"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { getLocationName } from "@/app/_utils/locations";
import { EditScheduleForm } from "@/app/my-schedules/_components/edit-schedule-form";
import { Prisma } from "@prisma/client";
import { format, isAfter } from "date-fns";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export function BookedByUserDetailsDialog({
  startTime,
  room,
}: {
  startTime: Date;
  room: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: {
          meetings: true;
          user: { select: { name: true } };
          room: { select: { name: true; location: true } };
        };
      };
    };
  }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenDialog = () => setIsOpen((prev) => !prev);

  const formatedHourDate = format(startTime, "HH:mm");
  const hourHasPassed = isAfter(new Date(), startTime);

  const booking = room.bookings.find(
    (booking) => booking.startTime.toString() === startTime.toString()
  );

  if (!booking) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={hourHasPassed}
          className="bg-zinc-600 hover:bg-zinc-700"
        >
          <span className="flex gap-1 items-center">
            {formatedHourDate} <CheckIcon size={12} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogTitle>Deseja editar a sua reserva?</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-semibold text-gray-700">
              {booking.meetings[0].title}
            </p>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p>{booking.room.name}</p>
                {" - "}
                <p>{getLocationName(booking.room.location)}</p>
              </div>
              <div className="flex gap-1 items-center">
                <p>{format(booking.startTime, "dd MMMM yyyy")}</p>
                {" | "}
                <p>{format(booking.startTime, "HH:mm")}</p>
                {" - "}
                <p>{format(booking.endTime, "HH:mm")}</p>
              </div>
            </div>
          </div>
        </DialogDescription>
        <EditScheduleForm booking={booking} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
