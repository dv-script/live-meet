import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/_components/ui/dialog";
import { Room } from "@prisma/client";
import { DeleteRoomForm } from "./delete-room-form";

export function DeleteRoomDialog({ room }: { room: Room }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 justify-normal">
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deseja deletar {room.name}?</DialogTitle>
          <DialogDescription>
            Ao deletar esta sala de reunião, você não poderá recuperá-la. Tem
            certeza que deseja deletar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DeleteRoomForm room={room} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
