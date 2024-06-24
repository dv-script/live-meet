"use client";

import { scheduleARoom } from "@/app/_actions/schedule-a-room";
import { FormError } from "@/app/_components/form-error";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import React, { useCallback, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function BookingForm({
  setIsOpen,
  roomId,
  userId,
  hourDate,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: number;
  userId: string | undefined;
  hourDate: Date;
}) {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(scheduleARoom, initialState);

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message, handleCloseDialog]);

  const hourDateISOString = hourDate.toISOString();

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="hourDate" value={hourDateISOString} />
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

      {!state.success && state.message && (
        <FormError errorMessage={state.message} />
      )}
      <SubmitButton>Reservar</SubmitButton>
    </form>
  );
}
