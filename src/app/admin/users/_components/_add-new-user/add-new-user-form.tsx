"use client";

import { addNewUser } from "@/app/_actions/add-new-user";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { createHash } from "@/app/_utils/create-hash";
import { departments } from "@/app/_utils/departments";
import { roles } from "@/app/_utils/roles";
import { LockKeyholeIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function AddNewUserForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(addNewUser, initialState);

  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const generatePassword = () => {
    const hash = createHash();
    setPassword(hash);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  const handleDeparmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    }
  }, [state.success, state.message, handleCloseDialog]);

  return (
    <form action={dispatch} className="flex flex-col gap-4 py-4">
      <FormField
        label="Nome"
        name="name"
        placeholder="Insira o nome do usuário"
        errorMessages={state.errors?.name}
      />
      <FormField
        label="E-mail"
        name="email"
        placeholder="Insira o e-mail do usuário"
        errorMessages={state.errors?.email}
      />
      <div className="flex flex-col gap-3">
        <Label>Senha</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              name="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Insira a senha do usuário"
              className={state.errors?.password && "border-red-500"}
            />
            <Button
              onClick={generatePassword}
              type="button"
              variant="secondary"
              size="icon"
            >
              <LockKeyholeIcon size={16} />
            </Button>
          </div>
          {state.errors?.password &&
            state.errors.password.map((error) => (
              <p
                aria-live="polite"
                key={error}
                className="text-xs text-red-500"
              >
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Time</Label>
        <div className="flex flex-col gap-2">
          <Select name="department" onValueChange={handleDeparmentChange}>
            <SelectTrigger>
              <SelectValue>{selectedDepartment}</SelectValue>
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
      </div>
      <div className="flex flex-col gap-3">
        <Label>Cargo</Label>
        <div className="flex flex-col gap-2">
          <Select name="role" onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue>{selectedRole}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem
                  className="cursor-pointer"
                  value={role.name}
                  key={role.value}
                >
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.role &&
            state.errors.role.map((error) => (
              <p
                aria-live="polite"
                key={error}
                className="text-xs text-red-500"
              >
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton type="submit" className="w-fit">
          Criar usuário
        </SubmitButton>
      </div>
    </form>
  );
}
