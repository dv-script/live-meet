"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth/providers";

const deleteUserFormSchema = z.object({
  id: z.string(),
});

export type State = {
  errors?: {
    id?: string[];
  };
  message: string;
  success?: boolean;
};

export async function deleteUser(_prevState: State, formData: FormData) {
  const validatedFields = deleteUserFormSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { id } = validatedFields.data;

  const session = await auth();
  if (session?.user?.id === id) {
    return {
      message: "Você não pode deletar o seu próprio usuário.",
      success: false,
    };
  }

  try {
    await db.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/users");
    return {
      message: "Usuário deletado com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao deletar o usuário. Por favor, tente novamente.",
      success: false,
    };
  }
}
