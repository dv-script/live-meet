"use client";

import { editSchedule } from "@/app/_actions/edit-schedule";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Prisma } from "@prisma/client";
import { addMinutes, format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const generateDateHours = (baseDate: Date) => {
  return Array.from({ length: 31 }, (_, index) => {
    const hour = 9 + Math.floor(index / 2);
    const minute = (index % 2) * 30;
    const newDate = new Date(baseDate);

    if (index === 30) {
      newDate.setDate(newDate.getDate() + 1);
      newDate.setHours(0, 0, 0, 0);
    } else {
      newDate.setHours(hour, minute, 0, 0);
    }
    return newDate;
  });
};

export function EditScheduleForm({
  booking,
  setIsOpen,
}: {
  booking: Prisma.BookingGetPayload<{
    include: {
      room: { select: { name: true; location: true } };
      meetings: true;
    };
  }>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(editSchedule, initialState);

  const [selectedDate, setSelectedDate] = useState(booking.startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(booking.endTime);
  const [selectedStartTime, setSelectedStartTime] = useState(booking.startTime);

  const allHours = generateDateHours(selectedDate);

  const handleSelectDate: SelectSingleEventHandler = (date) => {
    if (date) {
      setSelectedDate(date);

      const newStartTimes = generateDateHours(date);
      let defaultStartTime = newStartTimes[0];

      if (isToday(date)) {
        defaultStartTime =
          newStartTimes.find((d) => d > new Date()) || newStartTimes[0];
      }
    }
  };

  const handleStartTime = (dateString: string) => {
    console.log(dateString);
    const date = new Date(dateString);
    const potentialEndTime = addMinutes(new Date(dateString), 30);

    setSelectedStartTime(date);
    if (date >= selectedEndTime) {
      setSelectedEndTime(potentialEndTime);
    }
  };

  const handleEndTime = (dateString: string) => {
    const date = new Date(dateString);

    setSelectedEndTime(date);
  };

  const isTodayValidation = isToday(selectedDate);
  const filteredStartTimes = allHours.filter((date) => {
    if (date.getHours() === 0) {
      return false;
    }

    return isTodayValidation ? date > new Date() : true;
  });

  const filteredEndTimes = allHours.filter((date) => {
    return date > selectedStartTime;
  });

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error(state.message);
    }

    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    }
  }, [state, handleCloseDialog]);

  return (
    <form className="flex flex-col gap-2" action={dispatch}>
      <input type="hidden" name="roomId" value={booking.roomId} />
      <input type="hidden" name="meetingId" value={booking.meetings[0].id} />
      <FormField
        label="Título"
        defaultValue={booking.meetings[0].title}
        name="reunionName"
        placeholder="Título da reunião"
        errorMessages={state?.errors?.reunionName}
      />
      <FormField
        label="Descrição"
        defaultValue={booking.meetings[0].description ?? ""}
        name="reunionDescription"
        placeholder="Descrição da reunião"
        errorMessages={state?.errors?.reunionDescription}
      />
      <div className="flex items-center gap-1 justify-center">
        <Calendar
          locale={ptBR}
          mode="single"
          className="capitalize"
          fromDate={new Date()}
          classNames={{ table: "mx-auto" }}
          selected={selectedDate}
          onSelect={handleSelectDate}
        />
        <div className="flex gap-1 items-center justify-center flex-col md:gap-3">
          <div className="flex flex-col gap-1">
            <Label>Ínicio</Label>
            <Select
              name="startTime"
              defaultValue={selectedStartTime.toISOString()}
              onValueChange={handleStartTime}
            >
              <SelectTrigger>
                <SelectValue>{format(selectedStartTime, "HH:mm")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredStartTimes.map((date) => (
                  <SelectItem
                    className="cursor-pointer"
                    value={date.toISOString()}
                    key={date.toISOString()}
                  >
                    {format(date, "HH:mm")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.startTime &&
              state?.errors?.startTime.map((error, index) => (
                <p
                  key={index}
                  className="text-xs text-red-500"
                  aria-live="polite"
                >
                  {error}
                </p>
              ))}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Término</Label>
            <Select
              name="endTime"
              value={selectedEndTime.toISOString()}
              onValueChange={handleEndTime}
            >
              <SelectTrigger>
                <SelectValue>{format(selectedEndTime, "HH:mm")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredEndTimes.map((date) => (
                  <SelectItem
                    className="cursor-pointer"
                    value={date.toISOString()}
                    key={date.toISOString()}
                  >
                    {format(date, "HH:mm")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.endTime &&
              state?.errors?.endTime.map((error, index) => (
                <p
                  key={index}
                  className="text-xs text-red-500"
                  aria-live="polite"
                >
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <SubmitButton className="w-full">Editar reserva</SubmitButton>
      </div>
    </form>
  );
}
