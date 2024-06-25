"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

const editScheduleSchema = z.object({
  meetingId: z.string(),
  reunionName: z
    .string({ message: "Nome da reunião é obrigatório." })
    .min(3, { message: "Nome da reunião deve ter no mínimo 3 caracteres." })
    .max(50, { message: "Nome da reunião deve ter no máximo 50 caracteres." }),
  reunionDescription: z.optional(z.string()),
});

export type State = {
  errors?: {
    meetingId?: string[];
    reunionName?: string[];
    reunionDescription?: string[];
  };
  message: string;
  success?: boolean;
};

export async function editSchedule(_prevState: State, formData: FormData) {
  const validatedFields = editScheduleSchema.safeParse({
    meetingId: formData.get("meetingId"),
    reunionName: formData.get("reunionName"),
    reunionDescription: formData.get("reunionDescription"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha os campos corretamente.",
    };
  }

  const { meetingId, reunionName, reunionDescription } = validatedFields.data;

  console.log("meetingId", meetingId);

  try {
    await db.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        title: reunionName,
        description: reunionDescription,
      },
    });

    revalidatePath("/booking");

    return {
      message: "Reserva editada com sucesso!",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao editar reserva. Por favor, tente novamente.",
      success: false,
    };
  }
}
