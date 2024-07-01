"use client";

import { changePassword } from "@/app/_actions/change-password";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(changePassword, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (!state.success && state.message) {
      toast.error(state.message);
      state.message = "";
    }
  }, [state]);

  return (
    <form ref={formRef} action={dispatch} className="flex flex-col gap-3">
      <FormField
        label="Senha atual"
        name="currentPassword"
        type="password"
        placeholder="Insira sua senha atual"
        errorMessages={state.errors?.currentPassword}
      />
      <FormField
        label="Nova senha"
        name="newPassword"
        type="password"
        placeholder="Insira sua nova senha"
        errorMessages={state.errors?.newPassword}
      />
      <FormField
        label="Confirme a nova senha"
        name="passwordConfirmation"
        type="password"
        placeholder="Confirme sua nova senha"
        errorMessages={state.errors?.passwordConfirmation}
      />
      <SubmitButton>Alterar senha</SubmitButton>
    </form>
  );
}
