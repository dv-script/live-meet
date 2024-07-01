"use client";

import { changePassword } from "@/app/_actions/change-password";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(changePassword, initialState);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    }

    if (!state.success && state.message) {
      toast.error(state.message);
      state.message = "";
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col gap-3">
      <FormField
        label="Senha atual"
        name="currentPassword"
        type="password"
        placeholder="Insira sua senha atual"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        errorMessages={state.errors?.currentPassword}
      />
      <FormField
        label="Nova senha"
        name="newPassword"
        type="password"
        placeholder="Insira sua nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        errorMessages={state.errors?.newPassword}
      />
      <FormField
        label="Confirme a nova senha"
        name="passwordConfirmation"
        type="password"
        placeholder="Confirme sua nova senha"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        errorMessages={state.errors?.passwordConfirmation}
      />
      <SubmitButton>Alterar senha</SubmitButton>
    </form>
  );
}
