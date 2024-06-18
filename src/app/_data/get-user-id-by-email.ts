import { db } from "../_lib/prisma";

export async function getUserIdByEmail(email: string) {
  try {
    const user = await db.user.findFirstOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return user.id;
  } catch (error) {
    throw new Error("Erro ao buscar usuário por e-mail.");
  }
}
