"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

const editScheduleSchema = z.object({
  meetingId: z.string(),
  roomId: z.number(),
  reunionName: z
    .string({ message: "Nome da reunião é obrigatório." })
    .min(3, { message: "Nome da reunião deve ter no mínimo 3 caracteres." })
    .max(50, { message: "Nome da reunião deve ter no máximo 50 caracteres." }),
  reunionDescription: z.optional(z.string()),
  startTime: z.string(),
  endTime: z.string(),
});

export type State = {
  errors?: {
    roomId?: string[];
    meetingId?: string[];
    reunionName?: string[];
    reunionDescription?: string[];
    startTime?: string[];
    endTime?: string[];
  };
  message: string;
  success?: boolean;
};

export async function editSchedule(_prevState: State, formData: FormData) {
  const validatedFields = editScheduleSchema.safeParse({
    roomId: Number(formData.get("roomId")),
    meetingId: formData.get("meetingId"),
    reunionName: formData.get("reunionName"),
    reunionDescription: formData.get("reunionDescription"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const {
    roomId,
    meetingId,
    reunionName,
    reunionDescription,
    startTime,
    endTime,
  } = validatedFields.data;

  if (new Date(startTime) < new Date()) {
    return {
      message:
        "Não é possível reservar salas em horários passados. Por favor tente novamente.",
      success: false,
    };
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return {
      message:
        "A data final da reunião não pode ser anterior ou igual ao início da reunião. Por favor, tente novamente.",
      success: false,
    };
  }

  const roomAlreadyBooked = await db.booking.findFirst({
    where: {
      AND: [
        {
          startTime: {
            lte: new Date(startTime),
          },
        },
        {
          endTime: {
            gt: new Date(endTime),
          },
        },
        {
          id: {
            not: meetingId,
          },
          roomId: {
            equals: roomId,
          },
        },
      ],
    },
  });

  if (roomAlreadyBooked) {
    return {
      message: "Sala já reservada para este horário. Por favor, escolha outro.",
      success: false,
    };
  }

  try {
    await db.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        title: reunionName,
        description: reunionDescription,
        booking: {
          update: {
            startTime: new Date(startTime),
            endTime: new Date(endTime),
          },
        },
      },
    });

    revalidatePath("/booking");

    return {
      message: "Reserva editada com sucesso!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Erro ao editar reserva. Por favor, tente novamente.",
      success: false,
    };
  }
}
