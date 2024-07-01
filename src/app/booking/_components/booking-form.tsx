"use client";

import { scheduleARoom } from "@/app/_actions/schedule-a-room";
import { FormError } from "@/app/_components/form-error";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { format, addMinutes, setHours, setMinutes, addDays } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function BookingForm({
  setIsOpen,
  roomId,
  startTime,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: number;
  startTime: Date;
}) {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(scheduleARoom, initialState);

  const generateEndTimes = (start: Date) => {
    const startFormat = format(start, "HH:mm");

    if (startFormat === "23:30") {
      return [setHours(setMinutes(addDays(new Date(start), 1), 0), 0)];
    }

    let times = [];
    let time = addMinutes(new Date(start), 30);
    while (format(time, "HH:mm") !== "00:00") {
      times.push(new Date(time));
      time = addMinutes(time, 30);
    }

    times.push(setHours(setMinutes(addDays(new Date(start), 1), 0), 0));

    return times;
  };

  const endTimes = generateEndTimes(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(
    generateEndTimes(startTime)[0]
  );

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleEndTime = (value: string) => {
    setSelectedEndTime(new Date(value));
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state?.success, state?.message, handleCloseDialog]);

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="startTime" value={startTime.toISOString()} />
      <FormField
        name="reunionName"
        label="Nome da Reunião"
        type="text"
        placeholder="Nome da reunião"
        errorMessages={state?.errors?.reunionName}
      />
      <FormField
        name="reunionDescription"
        label="Descrição da Reunião"
        type="text"
        placeholder="Descrição da reunião"
        errorMessages={state?.errors?.reunionDescription}
      />
      <div className="flex flex-col gap-1">
        <Label>Horario de término</Label>
        <Select
          name="endTime"
          onValueChange={handleEndTime}
          defaultValue={selectedEndTime.toISOString()}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue>{format(selectedEndTime, "HH:mm")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {endTimes.map((date) => (
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
            <p key={index} className="text-xs text-red-500" aria-live="polite">
              {error}
            </p>
          ))}
      </div>

      {!state.success && state.message && (
        <FormError errorMessage={state.message} />
      )}
      <SubmitButton>Reservar</SubmitButton>
    </form>
  );
}
