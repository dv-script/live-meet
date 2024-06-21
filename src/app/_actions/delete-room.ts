"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

const deleteRoomFormSchema = z.object({
  id: z.number(),
});

export type State = {
  errors?: {
    id?: string[];
  };
  message: string;
  success?: boolean;
};

export async function deleteRoom(_prevState: State, formData: FormData) {
  const validatedFields = deleteRoomFormSchema.safeParse({
    id: Number(formData.get("id")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { id } = validatedFields.data;

  console.log(id);

  try {
    await db.room.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/rooms");
    return {
      message: "Sala de reunião deletada com sucesso.",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao deletar o usuário.",
      success: false,
    };
  }
}
