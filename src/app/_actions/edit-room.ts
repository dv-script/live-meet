"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { Location } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { locationValidation } from "../_utils/locations";

const editRoomSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, { message: "Nome da sala precisa ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  capacity: z
    .number({ message: "A capacidade precisa ser um número" })
    .int({ message: "A capacidade precisa ser inteira" })
    .positive({ message: "A capacidade precisa ser um número positivo" })
    .max(200, { message: "A capacidade máxima é de 100 pessoas" })
    .min(1, { message: "A capacidade mínima é de 1 pessoa" }),
  location: z.string({ message: "É necessário selecionar uma localização" }),
});

export type State = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    capacity?: string[];
    location?: string[];
  };
  message: string;
  success?: boolean;
};

export async function editRoom(_prevState: State, formData: FormData) {
  const validatedFields = editRoomSchema.safeParse({
    id: Number(formData.get("id")),
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: Number(formData.get("capacity")),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { id, name, description, capacity, location } = validatedFields.data;

  const roomExists = await db.room.findUniqueOrThrow({
    where: {
      name,
    },
  });

  if (roomExists && roomExists.id !== id) {
    return {
      message:
        "Já existe uma sala de reunião com esse nome. Por favor, escolha outro.",
      success: false,
    };
  }

  console.log("Validating location");

  const validLocation = locationValidation(location);

  try {
    await db.room.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        capacity,
        location: validLocation as Location,
      },
    });

    revalidatePath("/admin/rooms");

    return {
      message: "Sala de reunião atualizada com sucesso.",
      success: true,
    };
  } catch (error) {
    return {
      message:
        "Erro ao atualizar a sala de reunião. Por favor, tente novamente.",
      success: false,
    };
  }
}
