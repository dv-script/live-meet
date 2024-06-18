import { randomUUID } from "crypto";
import { getVerificationTokenByEmail } from "../_data/get-verification-token-by-email";
import { db } from "../_lib/prisma";
import { getUserIdByEmail } from "../_data/get-user-id-by-email";

export async function generateVerificationToken(email: string) {
  const token = randomUUID();
  const expiration = new Date().getTime() + 1000 * 60 * 60 * 24;

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const userId = await getUserIdByEmail(email);

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires: new Date(expiration),
      userId,
    },
  });

  return verificationToken;
}
