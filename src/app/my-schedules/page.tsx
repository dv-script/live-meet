import Link from "next/link";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { auth } from "../auth/providers";
import { ScheduleList } from "./_components/schedule-list";

export default async function Page() {
  const session = await auth();
  const now = new Date();

  const bookings = await db.booking.findMany({
    where: {
      userId: session?.user?.id,
      endTime: {
        gte: now,
      },
    },
    include: {
      room: { select: { name: true, location: true } },
      meetings: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col gap-6 px-4 py-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-extrabold pb-[6px] text-gradient text-5xl md:text-6xl">
            Não há reuniões agendadas.
          </h1>
          <p className="text-sm">
            Volte para{" "}
            <strong className="font-bold text-gray-800">página inicial</strong>{" "}
            e faça as reservas de suas reuniões.
          </p>
        </div>
        <Button className="w-fit mx-auto" asChild>
          <Link href="/booking">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 flex flex-col gap-12 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Minhas Reuniões</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Veja as reuniões que você agendou. Clique em uma reunião para poder
          ver mais.
        </p>
      </div>
      <ScheduleList bookings={bookings} />
    </div>
  );
}
