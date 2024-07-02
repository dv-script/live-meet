"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth/providers";

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
  const session = await auth();

  if (!session?.user) {
    return {
      message: "Você precisa estar logado para editar a reserva.",
      success: false,
    };
  }

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

  const meeting = await db.meeting.findUnique({
    where: {
      id: meetingId,
    },
    include: {
      booking: true,
    },
  });

  if (!meeting) {
    return {
      message: "Reunião não encontrada. Por favor, tente novamente.",
      success: false,
    };
  }

  if (roomId !== meeting.booking.roomId) {
    return {
      message: "Sala de reunião inválida. Por favor, tente novamente.",
      success: false,
    };
  }

  if (meeting.booking.userId !== session?.user?.id) {
    return {
      message: "Essa reunião não pertence a você. Por favor, tente novamente.",
      success: false,
    };
  }

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

  const alreadyBooked = await db.booking.findFirst({
    where: {
      AND: [
        {
          startTime: {
            gte: new Date(startTime),
          },
          endTime: {
            lte: new Date(endTime),
          },
        },
        {
          roomId,
          id: {
            not: meeting.bookingId,
          },
        },
      ],
    },
  });

  if (alreadyBooked) {
    return {
      message:
        "Essa sala já está reservada nesse horário. Por favor, tente novamente.",
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
      message: "Reserva alterada com sucesso! 🎉",
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
