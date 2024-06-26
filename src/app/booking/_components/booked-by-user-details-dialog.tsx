"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Prisma } from "@prisma/client";
import { format, isAfter, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { EditBookingForm } from "./edit-booking-form";

export function BookedByUserDetailsDialog({
  hourDate,
  room,
}: {
  hourDate: Date;
  room: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: { meetings: true; user: { select: { name: true } } };
      };
    };
  }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenDialog = () => setIsOpen((prev) => !prev);

  const formatedHourDate = format(hourDate, "HH:mm");
  const formatedDate = format(hourDate, "dd MMMM", { locale: ptBR });

  const now = new Date();
  const adjustedNow = subMinutes(now, 5);
  const hourHasPassed = isAfter(adjustedNow, hourDate);

  const booking = room.bookings.find(
    (booking) => booking.startTime.toString() === hourDate.toString()
  );

  const meeting = booking?.meetings.find(
    (meeting) => meeting.bookingId === booking.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={hourHasPassed}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          <span className="flex gap-1 items-center">
            {formatedHourDate} <CheckIcon size={12} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1">
            <span className="text-left">
              Você reservou essa sala{" - "}
              <strong className="font-bold text-gray-500 dark:text-gray-400">
                {room.name}
              </strong>
            </span>
            <span className="text-sm text-left text-gray-500 dark:text-gray-400">
              {formatedDate} às {formatedHourDate}
            </span>
          </DialogTitle>
        </DialogHeader>
        <EditBookingForm meeting={meeting} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
