"use client";

import { deleteRoom } from "@/app/_actions/delete-room";
import { SubmitButton } from "@/app/_components/submit-button";
import { Room } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function DeleteRoomForm({ room }: { room: Room }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(deleteRoom, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    }

    if (state.errors?.id) {
      toast.error(state.message);
    }
  }, [state.success, state.message, state.errors]);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={room.id} />
      <SubmitButton type="submit">Deletar</SubmitButton>
    </form>
  );
}
