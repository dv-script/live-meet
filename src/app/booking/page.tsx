import { db } from "../_lib/prisma";
import { auth } from "../auth/providers";
import { RoomList } from "./_components/room-list";
import { UpcomingMeetings } from "./_components/upcoming-meetings";

export default async function Page() {
  const session = await auth();
  const rooms = await db.room.findMany({
    include: {
      bookings: {
        include: { user: { select: { name: true } }, meetings: true },
      },
    },
    orderBy: {
      location: "asc",
    },
  });

  const userId = session?.user?.id;

  return (
    <div className="px-4 py-8 flex flex-col gap-12 max-w-screen-xl mx-auto">
      <RoomList userId={userId} rooms={rooms} />
      <UpcomingMeetings rooms={rooms} />
    </div>
  );
}
