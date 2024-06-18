import { db } from "../_lib/prisma";

export async function getVerificationTokenByEmail(email: string) {
  try {
    return db.verificationToken.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    throw error;
  }
}
