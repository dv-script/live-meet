"use server";

import { resend } from "../_lib/resend";
import React from "react";
import { VerificationEmail } from "../_email/email-verification";

export async function sendEmailVerification({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirme seu e-mail - Live Meet",
      react: React.createElement(VerificationEmail, {
        name: name,
        token,
      }),
    });
  } catch (error) {
    throw new Error("Não foi possível enviar o e-mail de confirmação.");
  }
}
