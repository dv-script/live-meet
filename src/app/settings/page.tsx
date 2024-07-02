import { Metadata } from "next";
import { db } from "../_lib/prisma";
import { auth } from "../auth/providers";
import { SettingsContainer } from "./_components/settings-container";

export const metadata: Metadata = {
  title: "LiveMeet | Configurações",
  description: "Configurações da conta do usuário",
};

export default async function Page() {
  const session = await auth();

  const user = await db.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      name: true,
      department: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-8 max-w-screen-xl mx-auto">
      <SettingsContainer user={user} />
    </div>
  );
}
