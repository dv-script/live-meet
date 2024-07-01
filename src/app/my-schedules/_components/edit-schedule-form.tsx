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
import { addMinutes, format, isToday } from "date-fns";
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

  const [selectedDate, setSelectedDate] = useState(new Date(booking.startTime));
  const [selectedEndTime, setSelectedEndTime] = useState(
    new Date(booking.endTime)
  );
  const [selectedStartTime, setSelectedStartTime] = useState(
    new Date(booking.startTime)
  );

  let allHours = generateDateHours(selectedDate);

  const handleSelectDate: SelectSingleEventHandler = (date) => {
    if (date) {
      setSelectedDate(date);
      let newStartTimes = generateDateHours(date);
      let defaultStartTime = newStartTimes[0];
      if (isToday(date)) {
        const currentTime = new Date();
        defaultStartTime =
          newStartTimes.find((d) => d > currentTime) || newStartTimes[0];
      }
      setSelectedStartTime(defaultStartTime);
      setSelectedEndTime(addMinutes(defaultStartTime, 30));
    }
  };

  const handleStartTime = (dateString: string) => {
    const date = new Date(dateString);
    setSelectedStartTime(date);
    const potentialEndTime = addMinutes(date, 30);
    setSelectedEndTime(potentialEndTime);
  };

  const handleEndTime = (dateString: string) => {
    const date = new Date(dateString);
    setSelectedEndTime(date);
  };

  const currentTime = new Date();
  const isTodayBoolean =
    selectedDate.toDateString() === currentTime.toDateString();
  const filteredStartTimes = allHours.filter((date) => {
    if (date.getHours() === 0) {
      return false;
    }

    return isTodayBoolean ? date > currentTime : true;
  });

  const filteredEndTimes = allHours.filter((date) => {
    return date > selectedStartTime;
  });

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    }

    if (state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, handleCloseDialog]);

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
              defaultValue={format(booking.startTime, "HH:mm")}
              onValueChange={handleStartTime}
            >
              <SelectTrigger className="col-span-3">
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
              defaultValue={format(new Date(booking.endTime), "HH:mm")}
              onValueChange={handleEndTime}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue>
                  {format(new Date(selectedEndTime), "HH:mm")}
                </SelectValue>
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
