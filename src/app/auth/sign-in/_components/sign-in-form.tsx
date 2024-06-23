"use client";

import { Button } from "@ui/button";
import Link from "next/link";
import { useFormState } from "react-dom";
import { authenticateUser } from "@actions/authenticate-user";
import { SubmitButton } from "@/app/_components/submit-button";
import { FormError } from "@/app/_components/form-error";
import { FormField } from "@/app/_components/form-field";

export function SignInForm() {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(authenticateUser, initialState);

  return (
    <form action={dispatch} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4">
          <FormField
            label="E-mail"
            name="email"
            placeholder="Digite sua conta de e-mail"
            errorMessages={state?.errors?.email}
          />
          <FormField
            label="Senha"
            name="password"
            placeholder="Digite sua senha"
            type="password"
            errorMessages={state?.errors?.password}
          />
          {state?.success === false && (
            <FormError errorMessage={state.message} />
          )}
        </div>
        <div className="flex justify-end">
          <Button asChild variant="link" className="text-sm p-0 h-fit">
            <Link href="/">Esqueceu sua senha?</Link>
          </Button>
        </div>
      </div>
      <SubmitButton type="submit">Entrar</SubmitButton>
    </form>
  );
}
