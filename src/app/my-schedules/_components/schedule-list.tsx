import { Prisma } from "@prisma/client";
import { Schedule } from "./schedule";

export function ScheduleList({
  bookings,
}: {
  bookings: Prisma.BookingGetPayload<{
    include: {
      room: { select: { name: true; location: true } };
      meetings: true;
    };
  }>[];
}) {
  return (
    <div className="grid items-center md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <Schedule key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
