"use client";

import { cancelSchedule } from "@/app/_actions/cancel-schedule";
import { SubmitButton } from "@/app/_components/submit-button";
import { Prisma } from "@prisma/client";
import { useCallback, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function CancelScheduleForm({
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
  const [state, dispatch] = useFormState(cancelSchedule, initialState);

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, handleCloseDialog]);

  return (
    <form action={dispatch}>
      <input type="hidden" value={booking.id} name="bookingId" />
      <SubmitButton size="sm" type="submit">
        Confirmar
      </SubmitButton>
    </form>
  );
}
