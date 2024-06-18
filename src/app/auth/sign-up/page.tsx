import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center px-4 py-12 max-w-screen-xl mx-auto">
      <div className="flex flex-col justify-center gap-8 max-w-screen-md">
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-gradient text-3xl font-bold tracking-tight text-center">
            Registre-se com a sua conta Livemode
          </h1>
          <div className="flex gap-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Ou</p>
            <Button asChild variant="link" className="text-sm p-0 h-fit">
              <Link href="/auth/sign-in">faça login</Link>
            </Button>
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
