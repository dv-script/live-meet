import { Prisma } from "@prisma/client";
import { Card, CardContent } from "@ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { Button } from "@ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format, isAfter, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLocationName } from "@/app/_utils/locations";
import { BookingDialog } from "./booking-dialog";

export function RoomItem({
  room,
  selectedDate,
  userId,
}: {
  room: Prisma.RoomGetPayload<{
    include: { bookings: true };
  }>;
  selectedDate: Date;
  userId: string | undefined;
}) {
  const roomHasBookings = room.bookings.length > 0 && {
    color: "bg-yellow-500",
    title: "Parcialmente Reservado",
  };
  const roomIsFullyBooked = room.bookings.length === 24 && {
    color: "bg-red-500",
    title: "Indisponível",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-semibold whitespace-nowrap">
                  {room.name}
                </h3>
                {room.description && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link" size="icon-xs" className="h-4 w-4">
                        <Info size={12} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2" align="start">
                      <p>{room.description}</p>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <span className="font-bold whitespace-nowrap">
                {getLocationName(room.location)}
              </span>
            </div>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {room.capacity} pessoas
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CalendarIcon size={16} className="text-gray-600" />
              <span className="font-medium">
                {format(selectedDate, "dd MMM", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  roomHasBookings && roomHasBookings.color
                } ${roomIsFullyBooked && roomIsFullyBooked.color}
                 bg-green-500
                `}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {roomHasBookings && roomHasBookings.title}
                {roomIsFullyBooked && roomIsFullyBooked.title}
                {!roomHasBookings && !roomIsFullyBooked && "Disponível"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 24 }).map((_, index) => {
              const hourDate = new Date(selectedDate);
              hourDate.setHours(index, 0, 0, 0);

              const isSpecificHourBooked = room.bookings.some(
                (booking) =>
                  format(booking.startTime, "yyyy-MM-dd HH:mm") ===
                  format(hourDate, "yyyy-MM-dd HH:mm")
              );

              const now = new Date();
              const adjustedNow = subMinutes(now, 45);

              const hourHasPassed = isAfter(adjustedNow, hourDate);
              return (
                <BookingDialog
                  key={index}
                  room={room}
                  userId={userId}
                  hourDate={hourDate}
                  hourHasPassed={hourHasPassed}
                  isBooked={isSpecificHourBooked}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
