"use client";

import { deleteUser } from "@/app/_actions/delete-user";
import { SubmitButton } from "@/app/_components/submit-button";
import { User } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function DeleteUserForm({ user }: { user: Omit<User, "password"> }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(deleteUser, initialState);

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
      <input type="hidden" name="id" value={user.id} />
      <SubmitButton type="submit">Deletar</SubmitButton>
    </form>
  );
}
