"use client";

import { logout } from "../_actions/logout";
import { SubmitButton } from "./submit-button";

export function SignOutForm() {
  return (
    <form action={logout} className="w-fit">
      <SubmitButton type="submit">Sair</SubmitButton>
    </form>
  );
}
