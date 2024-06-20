"use client";

import { validateEmailByToken } from "@/app/_actions/validate-email-by-token";
import { SubmitButton } from "@/app/_components/submit-button";
import { notFound, redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ResendTokenForm } from "./resend-token-form";

export function VerifyEmailForm() {
  const tokenId = useSearchParams().get("token");

  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(validateEmailByToken, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("E-mail verificado com sucesso!");
      redirect("/auth/sign-in");
    }

    if (!state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  if (!tokenId) {
    return notFound();
  }

  return (
    <>
      {!state.message && (
        <div className="mx-auto flex flex-col gap-5 items-center">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="font-extrabold text-gradient text-5xl md:text-6xl">
              Falta pouco para finalizar sua conta!
            </h1>
            <p className="text-gray-600 text-sm">
              Clique no botão abaixo para verificar o seu e-mail.
            </p>
          </div>
          <form action={dispatch}>
            <input type="hidden" name="tokenId" value={tokenId} />
            <SubmitButton size="sm">Verificar e-mail</SubmitButton>
          </form>
        </div>
      )}

      {state.success === false && (
        <div className="flex flex-col gap-4 items-center mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Erro ao verificar e-mail</h1>
            <p className="text-gray-600 text-sm">{state.message}</p>
          </div>
          <ResendTokenForm />
        </div>
      )}
    </>
  );
}
