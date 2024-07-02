"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { Department } from "@prisma/client";
import { departmentValidation } from "../_utils/departments";
import { auth } from "../auth/providers";

const editMyProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome precisa ter no mínimo 3 caracteres" }),
  department: z.string({ message: "É necessário selecionar um departamento" }),
});

export type State = {
  errors?: {
    name?: string[];
    department?: string[];
  };
  message: string;
  success?: boolean;
};

export async function editMyProfile(_prevState: State, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      message: "Você precisa estar logado para atualizar a sua conta.",
      success: false,
    };
  }

  const validatedFields = editMyProfileSchema.safeParse({
    name: formData.get("name"),
    department: formData.get("department"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { name, department } = validatedFields.data;

  const validDepartment = departmentValidation(department);

  try {
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        department: validDepartment as Department,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/");

    return {
      message: "Sua conta foi atualizada com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: "Erro ao atualizar a sua conta. Por favor, tente novamente.",
        success: false,
      };
    }
    throw error;
  }
}
