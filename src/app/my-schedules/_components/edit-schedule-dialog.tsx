"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { getLocationName } from "@/app/_utils/locations";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { EditScheduleForm } from "./edit-schedule-form";

export function EditScheduleDialog({
  booking,
}: {
  booking: Prisma.BookingGetPayload<{
    include: {
      room: { select: { name: true; location: true } };
      meetings: true;
    };
  }>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger
        className="w-0 h-0 transition-all duration-200 group-hover:h-6 group-hover:w-6"
        asChild
      >
        <Button variant="outline" size="icon-xs">
          <SquarePen size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
