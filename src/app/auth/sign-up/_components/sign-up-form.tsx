"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/app/_components/submit-button";
import { FormError } from "@/app/_components/form-error";
import { createAccount } from "@/app/_actions/create-account";
import { FormField } from "@/app/_components/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Label } from "@/app/_components/ui/label";
import { departments } from "@/app/_utils/departments";
import { useEffect, useState } from "react";
import { Department } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export function SignUpForm() {
  const [selectedDeparment, setSelectedDepartment] = useState("");

  function handleDepartmentChange(department: Department) {
    setSelectedDepartment(department);
  }

  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createAccount, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(
        "Conta criada com sucesso! Agora você precisa confirmar o seu e-mail."
      );
    }
  }, [state.success]);

  return (
    <>
      {!state.success ? (
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
          <form action={dispatch} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <FormField
                  label="E-mail"
                  name="email"
                  placeholder="Digite sua conta de e-mail"
                  errorMessages={state.errors?.email}
                />
                <FormField
                  label="Nome"
                  name="name"
                  placeholder="Digite seu nome"
                  errorMessages={state.errors?.name}
                />
                <div className="flex flex-col gap-1">
                  <Label>Time</Label>
                  <Select
                    name="department"
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue>{selectedDeparment}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          className="cursor-pointer"
                          value={department.name}
                          key={department.value}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state.errors?.department &&
                    state.errors.department.map((error) => (
                      <p
                        aria-live="polite"
                        key={error}
                        className="text-xs text-red-500"
                      >
                        {error}
                      </p>
                    ))}
                </div>
                <FormField
                  label="Senha"
                  name="password"
                  placeholder="Digite sua senha"
                  type="password"
                  errorMessages={state.errors?.password}
                />
                <FormField
                  label="Confirme sua senha"
                  name="passwordConfirmation"
                  placeholder="Confirme sua senha"
                  type="password"
                  errorMessages={state.errors?.passwordConfirmation}
                />
              </div>
            </div>
            <SubmitButton type="submit">Cadastre-se</SubmitButton>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4 text-center">
          <h1 className="font-extrabold text-gradient text-5xl md:text-6xl">
            Falta pouco para finalizar sua conta!
          </h1>
          <div className="w-full md:w-1/2 mx-auto">
            <p className="text-muted-foreground">
              Agora você precisa confirmar o seu e-mail para acessar a sua
              conta.
            </p>
          </div>
          <Button asChild className="w-fit mx-auto">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      )}
    </>
  );
}
