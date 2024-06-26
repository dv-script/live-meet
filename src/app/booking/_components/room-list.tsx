"use client";

import { Prisma } from "@prisma/client";
import { RoomItem } from "./room-item";
import { Calendar } from "@/app/_components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

export function RoomList({
  rooms,
  userId,
}: {
  rooms: Prisma.RoomGetPayload<{
    include: {
      bookings: {
        include: { meetings: true; user: { select: { name: true } } };
      };
    };
  }>[];
  userId: string | undefined;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelectDate: SelectSingleEventHandler = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="grid items-center sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Salas de Reuniões</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Reserve uma sala de reuniões para você e para a sua equipe.
          </p>
        </div>

        <div className="mx-auto">
          <Calendar
            locale={ptBR}
            mode="single"
            className="capitalize"
            fromDate={new Date()}
            classNames={{
              cell: "md:mx-1",
            }}
            selected={selectedDate}
            onSelect={handleSelectDate}
          />
        </div>
      </div>
      {rooms.map((room) => {
        return (
          <RoomItem
            key={room.id}
            userId={userId}
            selectedDate={selectedDate}
            room={room}
          />
        );
      })}
    </div>
  );
}
