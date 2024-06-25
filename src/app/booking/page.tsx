import { db } from "../_lib/prisma";
import { auth } from "../auth/providers";
import { RoomList } from "./_components/room-list";

export default async function Page() {
  const session = await auth();
  const rooms = await db.room.findMany({
    include: {
      bookings: {
        include: {
          meetings: true,
        },
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
      <div className="grid gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Upcoming Meetings</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Team Brainstorming</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Conference Room A - 11:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
