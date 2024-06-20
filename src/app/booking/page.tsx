import { auth } from "../auth/providers";

export default async function Page() {
  const session = await auth();

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
