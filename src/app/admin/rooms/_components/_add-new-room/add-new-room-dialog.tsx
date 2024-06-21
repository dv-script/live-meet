"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { AddNewRoomForm } from "./add-new-room-form";
import { useState } from "react";

export function AddNewRoomDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button className="w-fit">Adicionar nova sala de reunião</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>Adicionar uma nova sala de reunião</DialogHeader>
        <DialogDescription>
          Adicione uma nova sala de reunião na Live Meet.
        </DialogDescription>
        <AddNewRoomForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
