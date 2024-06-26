import { Prisma } from "@prisma/client";
import { Card, CardContent } from "@ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { Button } from "@ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format, isAfter, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLocationName } from "@/app/_utils/locations";
import { BookingDialog } from "./booking-dialog";
import { BookedByUserDetailsDialog } from "./booked-by-user-details-dialog";

export function RoomItem({
  room,
  selectedDate,
  userId,
}: {
  room: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: { meetings: true; user: { select: { name: true } } };
      };
    };
  }>;
  selectedDate: Date;
  userId: string | undefined;
}) {
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
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const hourDate = new Date(selectedDate);
              const startHour = 9;
              const hourToAdd = Math.floor(index / 2) + startHour;
              const minutesToAdd = (index % 2) * 30;
              hourDate.setHours(hourToAdd, minutesToAdd, 0, 0);

              const isSpecificHourBooked = room.bookings.some(
                (booking) =>
                  format(booking.startTime, "yyyy-MM-dd HH:mm") ===
                  format(hourDate, "yyyy-MM-dd HH:mm")
              );

              const bookedByUser = room.bookings.find(
                (booking) =>
                  format(booking.startTime, "yyyy-MM-dd HH:mm") ===
                    format(hourDate, "yyyy-MM-dd HH:mm") &&
                  booking.userId === userId
              );

              if (bookedByUser) {
                return (
                  <BookedByUserDetailsDialog
                    key={index}
                    room={room}
                    hourDate={hourDate}
                  />
                );
              }

              return (
                <BookingDialog
                  key={index}
                  hourDate={hourDate}
                  room={room}
                  isBooked={isSpecificHourBooked}
                  userId={userId}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
