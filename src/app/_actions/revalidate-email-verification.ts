"use server";

import { db } from "../_lib/prisma";
import { z } from "zod";
import { generateVerificationToken } from "../_utils/token";
import { sendEmailVerification } from "./send-email-verification";

const resendEmailVerificationSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor, insira um e-mail válido" })
    .regex(/@livemode.com$/, {
      message: "Por favor, insira um e-mail de domínio @livemode.com",
    }),
});

export type State = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function resendEmailVerification(
  _prevState: State,
  formData: FormData
) {
  const validatedFields = resendEmailVerificationSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const { email } = validatedFields.data;

  const userInDb = await db.user.findUnique({
    where: { email },
    include: { verificationTokens: true },
  });

  if (!userInDb) {
    return {
      message: "E-mail não cadastrado. Faça o seu cadastro.",
      success: false,
    };
  }

  if (userInDb?.emailVerified) {
    return {
      message: "E-mail já verificado. Faça o seu login.",
      success: false,
    };
  }

  const tokenStillValid = userInDb?.verificationTokens.flatMap((token) => {
    return new Date(token.expires) > new Date();
  });

  if (tokenStillValid?.includes(true)) {
    return {
      message:
        "Sua conta já possui um token válido. Por favor, verifique sua caixa de entrada.",
      success: false,
    };
  }

  const newToken = await generateVerificationToken(email);

  try {
    await db.user.update({
      where: { email },
      data: { verificationTokens: { connect: { id: newToken.id } } },
    });

    await sendEmailVerification({
      name: userInDb!.name,
      email,
      token: newToken.id,
    });

    return {
      message:
        "E-mail reenviado com sucesso! Por favor, verifique sua caixa de entrada 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao reenviar e-mail. Por favor, tente novamente.",
      success: false,
    };
  }
}
