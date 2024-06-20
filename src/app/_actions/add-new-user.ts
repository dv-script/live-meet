"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "../_lib/prisma";
import { Department, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { departmentValidation } from "../_utils/departments";
import { roleValidation } from "../_utils/roles";

const addNewUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome precisa ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "O e-mail não é válido" }),
  password: z
    .string()
    .min(8, { message: "Senha precisa ter no mínimo 8 caracteres" })
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
  department: z.string({ message: "É necessário selecionar um departamento" }),
  role: z.string({ message: "É necessário selecionar um cargo" }),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    department?: string[];
  };
  message: string;
  success?: boolean;
};

export async function addNewUser(_prevState: State, formData: FormData) {
  const validatedFields = addNewUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    department: formData.get("department"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { name, email, password, role, department } = validatedFields.data;

  const validateUniqueEmail = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (validateUniqueEmail) {
    return {
      errors: {
        email: ["E-mail já está em uso. Por favor, escolha outro."],
      },
      message: "E-mail já está em uso. Por favor, escolha outro.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const validDepartment = departmentValidation(department);
  const validRole = roleValidation(role);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: validRole as Role,
        department: validDepartment as Department,
        emailVerified: new Date(),
      },
    });

    revalidatePath("/admin/users");

    return {
      message: "Usuário criado com sucesso.",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao criar usuário. Por favor, tente novamente.",
      success: false,
    };
  }
}
