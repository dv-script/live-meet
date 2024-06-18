import { db } from "./_lib/prisma";

export default async function Page() {
  const rooms = await db.room.findMany({
    include: {
      availabilities: true,
    },
  });

  return (
    <div className="px-4 py-8 flex flex-col gap-12 max-w-screen-xl mx-auto">

    </div>
  );
}
