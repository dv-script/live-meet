"use client";

import { editSchedule } from "@/app/_actions/edit-schedule";
import { FormError } from "@/app/_components/form-error";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { Meeting } from "@prisma/client";
import { useCallback, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function EditBookingForm({
  setIsOpen,
  meeting,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meeting: Meeting | undefined;
}) {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(editSchedule, initialState);

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      handleCloseDialog();
    }

    if (!state?.success && state?.message) {
      toast.error(state?.message);
    }
  }, [state?.success, state?.message, handleCloseDialog]);

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <input type="hidden" name="meetingId" value={meeting?.id} />
      <FormField
        name="reunionName"
        label="Nome da Reunião"
        type="text"
        placeholder="Nome da reunião"
        errorMessages={state?.errors?.reunionName}
        defaultValue={meeting?.title}
      />
      <FormField
        name="reunionDescription"
        label="Descrição da Reunião"
        type="text"
        placeholder="Descrição da reunião"
        errorMessages={state?.errors?.reunionDescription}
        defaultValue={meeting?.description || ""}
      />

      {!state?.success && state?.message && (
        <FormError errorMessage={state?.message} />
      )}
      <SubmitButton className="w-fit ml-auto">Editar</SubmitButton>
    </form>
  );
}
