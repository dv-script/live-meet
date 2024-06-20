"use client";

import { resendEmailVerification } from "@/app/_actions/revalidate-email-verification";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function ResendTokenForm() {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(resendEmailVerification, initialState);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (state.success) {
      toast.success("Token reenviado com sucesso!");
    }

    if (state.success === false) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <form
      action={dispatch}
      className="w-full bg-gray-100 py-6 px-3 rounded-lg shadow-lg flex flex-col gap-4"
    >
      <FormField
        label="E-mail"
        name="email"
        placeholder="Insira o seu e-mail já cadastrado"
        errorMessages={state.errors?.email}
      />
      <SubmitButton size="sm" type="submit">
        Reenviar token
      </SubmitButton>
    </form>
  );
}
