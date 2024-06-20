import { VerifyEmailForm } from "./_components/verify-email-form";

export default async function Page() {
  return (
    <div className="px-4 py-8 flex flex-col gap-12 max-w-screen-xl mx-auto">
      <VerifyEmailForm />
    </div>
  );
}
