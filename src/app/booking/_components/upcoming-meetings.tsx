import { getLocationName } from "@/app/_utils/locations";
import { Prisma } from "@prisma/client";
import {
  addHours,
  format,
  formatDistanceToNow,
  setDefaultOptions,
} from "date-fns";
import { ptBR } from "date-fns/locale";

setDefaultOptions({ locale: ptBR });

export function UpcomingMeetings({
  rooms,
}: {
  rooms: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: {
          meetings: true;
          user: { select: { name: true } };
          room: { select: { name: true; location: true } };
        };
      };
    };
  }>[];
}) {
  const bookings = rooms.flatMap((room) => room.bookings);
  const upcomingMeetings = bookings.filter(
    (booking) =>
      booking.startTime <= addHours(new Date(), 2) &&
      booking.startTime > new Date()
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
                booking.startTime <= addHours(new Date(), 2) &&
                booking.startTime > new Date() && (
                  <div className="flex flex-col py-1" key={meeting.id}>
                    <h3 className="font-semibold leading-none">
                      {meeting.title} -{" "}
                      <span className="text-sm font-normal">
                        {booking.user.name}
                      </span>
                    </h3>
                    <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {room.name} - {getLocationName(room.location)}
                      </span>
                      <span>
                        {format(booking.startTime, "HH:mm")} -{" "}
                        {format(booking.endTime, "HH:mm")}
                      </span>
                      <span>
                        Iniciará em {formatDistanceToNow(booking.startTime)}
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
