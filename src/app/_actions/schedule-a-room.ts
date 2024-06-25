"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { subMinutes } from "date-fns";

const scheduleARoomSchema = z.object({
  userId: z.string(),
  roomId: z.number(),
  hourDate: z.string(),
  reunionName: z
    .string({ message: "Nome da reunião é obrigatório." })
    .min(3, { message: "Nome da reunião deve ter no mínimo 3 caracteres." })
    .max(50, { message: "Nome da reunião deve ter no máximo 50 caracteres." }),
  reunionDescription: z.optional(z.string()),
});

export type State = {
  errors?: {
    userId?: string[];
    roomId?: string[];
    hourDate?: string[];
    reunionName?: string[];
    reunionDescription?: string[];
  };
  message: string;
  success?: boolean;
};

export async function scheduleARoom(_prevState: State, formData: FormData) {
  const validatedFields = scheduleARoomSchema.safeParse({
    userId: formData.get("userId"),
    roomId: Number(formData.get("roomId")),
    hourDate: formData.get("hourDate"),
    reunionName: formData.get("reunionName"),
    reunionDescription: formData.get("reunionDescription"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { userId, roomId, hourDate, reunionName, reunionDescription } =
    validatedFields.data;

  await db.booking.deleteMany({
    where: {
      userId,
      startTime: {
        lte: subMinutes(new Date(), 5),
      },
    },
  });

  if (hourDate < subMinutes(new Date(), 5).toISOString()) {
    return {
      message: "Não é possível reservar salas em horários passados.",
      success: false,
    };
  }

  const isRoomBooked = await db.booking.findFirst({
    where: {
      startTime: new Date(hourDate),
      roomId,
    },
  });

  if (isRoomBooked) {
    return {
      message: "Sala já reservada para este horário. Por favor, escolha outro.",
      success: false,
    };
  }

  const booksByUser = await db.booking.findMany({
    where: {
      userId,
    },
  });

  if (booksByUser.length >= 5) {
    return {
      message:
        "Você já possui 5 reservas ativas. Por favor, cancele uma reserva para fazer outra.",
      success: false,
    };
  }

  try {
    await db.booking.create({
      data: {
        startTime: new Date(hourDate),
        roomId,
        userId,
      },
    });

    const bookingId = await db.booking.findFirstOrThrow({
      where: {
        startTime: new Date(hourDate),
        roomId,
        userId,
      },
    });

    await db.meeting.create({
      data: {
        title: reunionName,
        description: reunionDescription,
        bookingId: bookingId.id,
      },
    });

    revalidatePath("/booking");

    return {
      message: "Sala reservada com sucesso!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao reservar sala. Por favor, tente novamente.",
      success: false,
    };
  }
}
