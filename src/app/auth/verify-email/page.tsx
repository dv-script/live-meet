import { Suspense } from "react";
import { VerifyEmailForm } from "./_components/verify-email-form";
import { Loading } from "@/app/_components/loading";

export default async function Page() {
  return (
    <div className="px-4 py-8 flex flex-col gap-12 max-w-screen-xl mx-auto">
      <Suspense fallback={<Loading />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
