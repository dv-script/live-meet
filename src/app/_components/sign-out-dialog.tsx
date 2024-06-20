import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@ui/dialog";
import { SignOutForm } from "./sign-out-form";

export function SignOutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
          variant="ghost"
        >
          <LogOutIcon size={16} />
          <span className="block">Sair da conta</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja sair?</DialogTitle>
        </DialogHeader>
        <DialogDescription>Para continuar, clique em Sair</DialogDescription>
        <DialogFooter className="flex flex-row-reverse">
          <DialogClose asChild>
            <Button variant="ghost" className="w-fit">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <SignOutForm />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
