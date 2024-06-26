import { Prisma } from "@prisma/client";
import { addHours, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function UpcomingMeetings({
  rooms,
}: {
  rooms: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: { meetings: true; user: { select: { name: true } } };
      };
    };
  }>[];
}) {
  const bookings = rooms.flatMap((room) => room.bookings);
  const upcomingMeetings = bookings.filter(
    (booking) => booking.startTime < addHours(new Date(), 2)
  );

  if (upcomingMeetings.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold">Próximas Reuniões</h2>
      <div className="flex flex-col gap-2">
        {rooms.map((room) =>
          room.bookings.map((booking) =>
            booking.meetings.map(
              (meeting) =>
                booking.startTime <= addHours(new Date(), 2) && (
                  <div className="flex flex-col py-1" key={meeting.id}>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold">{meeting.title}</h3>
                      {" - "}
                      <span className="text-sm">{booking.user.name}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        {room.name}
                      </span>
                      {" - "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {format(booking.startTime, "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    {meeting.description && (
                      <p className="text-gray-400 text-sm">
                        {meeting.description}
                      </p>
                    )}
                  </div>
                )
            )
          )
        )}
      </div>
    </div>
  );
}
