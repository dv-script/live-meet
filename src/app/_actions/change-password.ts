"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import bcrypt from "bcrypt";
import { auth } from "../auth/providers";

const changePasswordchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/, {
      message: "A senha deve conter:",
    })
    .regex(/^(?=.*[A-Z]).*$/, {
      message: "- 1 Letra maiúscula",
    })
    .regex(/^(?=.*[a-z]).*$/, {
      message: "- 1 Letra minúscula",
    })
    .regex(/^(?=.*[0-9]).*$/, {
      message: "- 1 Número",
    })
    .regex(/^(?=.*[!@#$%^&*]).*$/, {
      message: "- 1 Caractere especial",
    }),
  passwordConfirmation: z.string(),
});

export type State = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    passwordConfirmation?: string[];
  };
  message: string;
  success?: boolean;
};

export async function changePassword(_prevState: State, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      message: "Você precisa estar logado para atualizar a sua conta.",
      success: false,
    };
  }

  const validatedFields = changePasswordchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { currentPassword, newPassword, passwordConfirmation } =
    validatedFields.data;

  if (newPassword !== passwordConfirmation) {
    return {
      errors: {
        passwordConfirmation: ["As senhas não coincidem."],
      },
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    return {
      message: "Usuário não encontrado.",
      success: false,
    };
  }

  const passwordComparation = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (passwordComparation === false) {
    return {
      errors: {
        currentPassword: ["A senha atual está incorreta."],
      },
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  try {
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: passwordHash,
        updatedAt: new Date(),
      },
    });

    return {
      message: "Sua senha foi atualizada com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: "Erro ao atualizar a sua senha. Por favor, tente novamente.",
        success: false,
      };
    }
    throw error;
  }
}
