"use client";

import { useFormStatus } from "react-dom";
import { Loading } from "./loading";
import { Button, ButtonProps } from "./ui/button";

export function SubmitButton({
  children,
  ...props
}: ButtonProps & { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending}>
      {pending ? <Loading /> : children}
    </Button>
  );
}
