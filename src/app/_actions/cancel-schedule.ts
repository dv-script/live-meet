"use server";

import { z } from "zod";
import { db } from "../_lib/prisma";
import { auth } from "../auth/providers";
import { revalidatePath } from "next/cache";

const cancelScheduleSchema = z.object({
  bookingId: z.string(),
});

export type State = {
  errors?: {
    bookingId?: string[];
  };
  message: string;
  success?: boolean;
};

export async function cancelSchedule(_prevState: State, formData: FormData) {
  const session = await auth();

  const validatedFields = cancelScheduleSchema.safeParse({
    bookingId: formData.get("bookingId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, preencha corretamente os campos.",
    };
  }

  const { bookingId } = validatedFields.data;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { userId: true },
  });

  if (!booking) {
    return {
      message: "Reserva não encontrada. Por favor, tente novamente.",
      success: false,
    };
  }

  if (booking?.userId !== session?.user?.id) {
    return {
      message: "Essa reserva não pertence a você. Por favor, tente novamente.",
      success: false,
    };
  }

  try {
    await db.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/");

    return {
      message: "Reserva cancelada com sucesso! 🎉",
      success: true,
    };
  } catch (error) {
    return {
      message: "Erro ao cancelar a reserva. Por favor, tente novamente.",
      success: false,
    };
  }
}
