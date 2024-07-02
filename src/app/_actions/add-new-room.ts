"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { Location } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { locationValidation } from "../_utils/locations";

const addNewRoomSchema = z.object({
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
    name?: string[];
    description?: string[];
    capacity?: string[];
    location?: string[];
  };
  message: string;
  success?: boolean;
};

export async function addNewRoom(_prevState: State, formData: FormData) {
  const validatedFields = addNewRoomSchema.safeParse({
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

  const { name, capacity, location, description } = validatedFields.data;

  const roomExists = await db.room.findFirst({
    where: {
      name,
    },
  });

  if (roomExists) {
    return {
      message:
        "Já existe uma sala de reunião com esse nome. Por favor, escolha outro.",
      success: false,
    };
  }

  const validLocation = locationValidation(location);

  try {
    await db.room.create({
      data: {
        name,
        description,
        capacity,
        location: validLocation as Location,
      },
    });

    revalidatePath("/admin/rooms");

    return {
      message: "Sala de reunião criada com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao criar a sala de reunião. Por favor, tente novamente.",
      success: false,
    };
  }
}
