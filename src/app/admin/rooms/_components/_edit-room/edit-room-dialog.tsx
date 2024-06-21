"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/app/_components/ui/dialog";
import { Room } from "@prisma/client";
import { useState } from "react";
import { EditRoomForm } from "./edit-room-form";

export function EditRoomDialog({ room }: { room: Room }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 justify-normal">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar sala de reunião</DialogTitle>
          <DialogDescription>
            Edite as informações da sala de reunião selecionada.
          </DialogDescription>
        </DialogHeader>
        <EditRoomForm setIsOpen={setIsOpen} room={room} />
      </DialogContent>
    </Dialog>
  );
}
