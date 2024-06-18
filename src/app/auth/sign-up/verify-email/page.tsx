export default function Page() {
  return (
    <div className="flex items-center justify-center px-4 py-12 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="font-extrabold text-gradient text-5xl md:text-6xl">
          Falta pouco para finalizar sua conta!
        </h1>
        <div className="w-full md:w-1/2 mx-auto">
          <p className="text-muted-foreground">
            Agora você precisa confirmar o seu e-mail para acessar a sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}
