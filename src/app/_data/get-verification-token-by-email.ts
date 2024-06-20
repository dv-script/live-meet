import { db } from "../_lib/prisma";

export async function getVerificationTokenByEmail(token: string) {
  try {
    return db.verificationToken.findFirst({
      where: {
        token,
      },
    });
  } catch (error) {
    throw error;
  }
}
