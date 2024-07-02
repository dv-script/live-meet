import { Metadata } from "next";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "LiveMeet | Registre-se",
  description: "Crie uma nova conta no LiveMeet com sua conta Livemode",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center px-4 py-12 max-w-screen-xl mx-auto">
      <SignUpForm />
    </div>
  );
}
