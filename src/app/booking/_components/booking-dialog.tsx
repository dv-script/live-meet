"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { useState } from "react";
import { BookingForm } from "./booking-form";
import { Prisma } from "@prisma/client";
import { ptBR } from "date-fns/locale";

export function BookingDialog({
  hourHasPassed,
  hourDate,
  room,
  isBooked,
  userId,
}: {
  hourHasPassed: boolean;
  hourDate: Date;
  room: Prisma.RoomGetPayload<{
    include: { bookings: true };
  }>;
  isBooked: boolean;
  userId: string | undefined;
}) {
  const [selectedHourDate, setSelectedHourDate] = useState<string>(
    hourDate.toISOString()
  );

  const [isOpen, setIsOpen] = useState(false);
  const handleOpenDialog = () => setIsOpen((prev) => !prev);

  const handleSelectHour = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedHourDate(e.currentTarget.value);
  };

  const formatedHourDate = format(hourDate, "HH:mm");
  const formatedDate = format(hourDate, "dd MMMM", { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isBooked || hourHasPassed}
          value={selectedHourDate}
          onClick={handleSelectHour}
        >
          {formatedHourDate}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1">
            <span className="text-left">
              Reservar Sala:{" "}
              <strong className="font-bold text-gray-500 dark:text-gray-400">
                {room.name}
              </strong>
            </span>
            <span className="text-sm text-left text-gray-500 dark:text-gray-400">
              {formatedDate} às {formatedHourDate}
            </span>
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          userId={userId}
          hourDate={hourDate}
          roomId={room.id}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
