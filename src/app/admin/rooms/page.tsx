import { db } from "@/app/_lib/prisma";
import { AddNewRoomDialog } from "./_components/_add-new-room/add-new-room-dialog";
import { RoomsTable } from "./_components/_rooms-table/rooms-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiveMeet | Dashboard - Salas de Reuniões",
  description: "Gerencie todas as salas de reuniões da LiveMeet",
};

export default async function Page() {
  const rooms = await db.room.findMany({
    orderBy: {
      location: "asc",
    },
  });

  return (
    <div className="px-4 py-3 flex flex-col gap-5 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <AddNewRoomDialog />
        <RoomsTable roomsData={rooms} />
      </div>
    </div>
  );
}
