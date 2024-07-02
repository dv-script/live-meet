"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../_lib/prisma";
import { Department } from "@prisma/client";
import { generateVerificationToken } from "../_utils/token";
import { departmentValidation } from "../_utils/departments";
import { sendEmailVerification } from "./send-email-verification";

const createAccountSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),

  department: z.string({ message: "Por favor, selecione o seu time" }),
  email: z
    .string()
    .email({ message: "Por favor, insira um e-mail válido" })
    .regex(/@livemode.com$/, {
      message: "Por favor, insira um e-mail de domínio @livemode.com",
    }),
  password: z
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
    name?: string[];
    department?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createAccount(_prevState: State, formData: FormData) {
  const validatedFields = createAccountSchema.safeParse({
    name: formData.get("name"),
    department: formData.get("department"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const { email, password, name, department, passwordConfirmation } =
    validatedFields.data;

  const userExists = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    return {
      errors: {
        email: ["Este e-mail já está em uso."],
      },
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  if (password !== passwordConfirmation) {
    return {
      errors: {
        passwordConfirmation: [
          "As senhas não coincidem. Por favor, tente novamente.",
        ],
      },
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const validDepartment = departmentValidation(department);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        email,
        name,
        department: validDepartment as Department,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendEmailVerification({
      email,
      name,
      token: verificationToken.token,
    });

    return {
      message: "Conta criada com sucesso! Verifique seu e-mail 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Algo deu errado. Por favor, tente novamente.",
      success: false,
    };
  }
}
