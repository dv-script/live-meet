"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth/providers";

const scheduleARoomSchema = z.object({
  roomId: z.number(),
  startTime: z.string(),
  endTime: z.string({ message: "Horário de término é obrigatório." }),
  reunionName: z
    .string({ message: "Nome da reunião é obrigatório." })
    .min(3, { message: "Nome da reunião deve ter no mínimo 3 caracteres." })
    .max(50, { message: "Nome da reunião deve ter no máximo 50 caracteres." }),
  reunionDescription: z.optional(z.string()),
});

export type State = {
  errors?: {
    roomId?: string[];
    startTime?: string[];
    endTime?: string[];
    reunionName?: string[];
    reunionDescription?: string[];
  };
  message: string;
  success?: boolean;
};

export async function scheduleARoom(_prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "Usuário não autenticado.",
      success: false,
    };
  }

  const validatedFields = scheduleARoomSchema.safeParse({
    roomId: Number(formData.get("roomId")),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    reunionName: formData.get("reunionName"),
    reunionDescription: formData.get("reunionDescription"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { roomId, startTime, endTime, reunionName, reunionDescription } =
    validatedFields.data;

  if (new Date(startTime) < new Date()) {
    return {
      message: "Não é possível reservar salas em horários passados.",
      success: false,
    };
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return {
      message: "Horário de término deve ser maior que o horário de início.",
      success: false,
    };
  }

  const isRoomBooked = await db.booking.findFirst({
    where: {
      AND: [
        {
          startTime: {
            gte: new Date(startTime),
          },
        },
        {
          startTime: {
            lt: new Date(endTime),
          },
        },
        {
          roomId: {
            equals: roomId,
          },
        },
      ],
    },
  });

  if (isRoomBooked) {
    return {
      message: "Sala já reservada para este horário. Por favor, escolha outro.",
      success: false,
    };
  }

  try {
    await db.booking.create({
      data: {
        userId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetings: {
          create: {
            title: reunionName,
            description: reunionDescription,
          },
        },
      },
    });

    revalidatePath("/booking");

    return {
      message: "Sala reservada com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao reservar sala. Por favor, tente novamente.",
      success: false,
    };
  }
}
