import Link from "next/link";
import { Button } from "../_components/ui/button";

export default function Page() {
  return (
    <div className="px-4 py-12 flex flex-col gap-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <h1 className="font-extrabold text-gradient text-4xl sm:5xl md:text-6xl">
          Dashboard de Administrador
        </h1>
        <p className="text-muted-foreground text-sm">
          Aqui você pode <strong className="text-black">gerenciar</strong> todos
          os usuários, salas de reuniões e reuniões da LiveMeet.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/users">Usuários</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/rooms">Salas de Reuniões</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/meetings">Reuniões</Link>
        </Button>
      </div>
    </div>
  );
}
