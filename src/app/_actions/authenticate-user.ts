"use server";

import { signIn } from "@/app/auth/providers";
import { AuthError } from "next-auth";
import { z } from "zod";
import { db } from "../_lib/prisma";
import { sendEmailVerification } from "./send-email-verification";

const authenticateUserSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function authenticateUser(_prevState: State, formData: FormData) {
  const validatedFields = authenticateUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const { email, password } = validatedFields.data;

  const user = await db.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  if (user?.emailVerified === null) {
    return {
      message: "E-mail não verificado. Por favor, cheque sua caixa de e-mail.",
      success: false,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/booking",
    });

    return {
      success: true,
      message: "Você foi logado com sucesso! 🎉",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return {
            message:
              "E-mail ou senha estão inválidos. Por favor, tente novamente.",
            success: false,
          };
        default:
          return {
            message: "Algo deu errado. Por favor, tente novamente.",
            success: false,
          };
      }
    }

    throw error;
  }
}
