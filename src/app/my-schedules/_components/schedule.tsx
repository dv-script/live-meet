import { getLocationName } from "@/app/_utils/locations";
import { Prisma } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditScheduleDialog } from "./edit-schedule-dialog";
import { CancelScheduleDialog } from "./cancel-schedule-dialog";

export function Schedule({
  booking,
}: {
  booking: Prisma.BookingGetPayload<{
    include: {
      room: { select: { name: true; location: true } };
      meetings: true;
    };
  }>;
}) {
  const status =
    booking.startTime > new Date()
      ? `Em ${formatDistanceToNow(booking.startTime, { locale: ptBR })}`
      : "Em andamento";

  return (
    <div
      key={booking.id}
      className="flex gap-2 justify-between border p-4 rounded-lg shadow-sm group"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-ellipsis whitespace-nowrap">
          {booking.meetings[0].title}
        </h3>
        <div className="flex gap-1 text-sm text-gray-400 ">
          <p>{format(booking.startTime, "dd MMM yyyy")}</p>
          <span>|</span>
          <p>{format(booking.startTime, "HH:mm", { locale: ptBR })}</p>
          <span>-</span>
          <p>{format(booking.endTime, "HH:mm")}</p>
        </div>
        <div className="flex gap-1 text-gray-400 dark:text-gray-300 text-sm">
          <p>{booking.room.name}</p>
          <span>-</span>
          <p>{getLocationName(booking.room.location)}</p>
        </div>
        <span className="text-xs text-gray-400 mt-4">{status}</span>
      </div>
      <div className="flex justify-center gap-1 items-center">
        <EditScheduleDialog booking={booking} />
        <CancelScheduleDialog booking={booking} />
      </div>
    </div>
  );
}
