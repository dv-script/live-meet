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
import { User } from "@prisma/client";
import { DeleteUserForm } from "./delete-user-form";

export function DeleteUserDialog({ user }: { user: Omit<User, "password"> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 justify-normal">
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deseja deletar {user.name}?</DialogTitle>
          <DialogDescription>
            Ao deletar este usuário, você não poderá recuperá-lo. Tem certeza
            que deseja deletar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DeleteUserForm user={user} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
