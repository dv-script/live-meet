"use server";

import { db } from "../_lib/prisma";
import { getVerificationTokenByToken } from "../_data/get-verification-token-by-token";
import { z } from "zod";

const validateEmailByTokenSchema = z.object({
  tokenId: z.string(),
});

export type State = {
  errors?: {
    tokenId?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function validateEmailByToken(
  _prevState: State,
  formData: FormData
) {
  const validatedFields = validateEmailByTokenSchema.safeParse({
    tokenId: formData.get("tokenId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const { tokenId } = validatedFields.data;

  const existingToken = await getVerificationTokenByToken(tokenId);

  if (!existingToken) {
    return {
      message:
        "Token inválido ou já verificado. Por favor, solicite novamente.",
      success: false,
    };
  }

  const tokenHasExpired = new Date(existingToken.expires) < new Date();

  if (tokenHasExpired) {
    return {
      message: "Token expirado. Por favor, solicite um novo token.",
      success: false,
    };
  }

  const existingUser = await db.user.findUnique({
    where: { id: existingToken.userId },
  });

  if (!existingUser) {
    return {
      message: "Usuário não encontrado. Por favor, tente novamente",
      success: false,
    };
  }

  try {
    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return {
      message: "E-mail verificado com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao verificar e-mail. Por favor, tente novamente.",
      success: false,
    };
  }
}
