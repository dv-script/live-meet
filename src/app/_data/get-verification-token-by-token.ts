import { db } from "../_lib/prisma";

export async function getVerificationTokenByToken(tokenId: string) {
  try {
    return db.verificationToken.findFirst({
      where: {
        token: tokenId,
      },
    });
  } catch (error) {
    throw error;
  }
}
