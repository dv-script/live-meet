"use client";

import { editUser } from "@/app/_actions/edit-user";
import { FormField } from "@/app/_components/form-field";
import { SubmitButton } from "@/app/_components/submit-button";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Department, Role, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { departments, getDeparmentName } from "@/app/_utils/departments";
import { getRoleName, roles } from "@/app/_utils/roles";

export function EditUserForm({
  user,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: Omit<User, "password">;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(editUser, initialState);

  const userDepartmentName = getDeparmentName(user.department);
  const userRoleName = getRoleName(user.role);
  const [selectedDeparment, setSelectedDepartment] = useState(userDepartmentName);
  const [selectedRole, setSelectedRole] = useState(userRoleName);


  const handleDepartmentChange = (value: Department) => {
    setSelectedDepartment(value);
  };

  const handleRoleChange = (value: Role) => {
    setSelectedRole(value);
  };

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      handleCloseDialog();
    }
  }, [state.success, state.message, handleCloseDialog]);

  return (
    <form action={dispatch} className="flex flex-col gap-4 py-4">
      <input type="hidden" name="id" value={user.id} />
      <FormField
        label="Nome"
        name="name"
        placeholder="Insira o nome do usuário"
        defaultValue={user.name}
        errorMessages={state.errors?.name}
      />
      <FormField
        label="Email"
        name="email"
        placeholder="Insira o email do usuário"
        defaultValue={user.email}
        errorMessages={state.errors?.email}
      />

      <div className="flex flex-col gap-3">
        <Label>Cargo</Label>
        <div className="flex flex-col gap-2">
          <Select
            name="role"
            defaultValue={userRoleName}
            onValueChange={handleRoleChange}
          >
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
      <div className="flex flex-col gap-3">
        <Label>Time</Label>
        <Select
          name="department"
          defaultValue={userDepartmentName}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
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
            <p aria-live="polite" key={error} className="text-xs text-red-500">
              {error}
            </p>
          ))}
      </div>
      <div className="flex justify-end">
        <SubmitButton className="w-fit">Salvar alterações</SubmitButton>
      </div>
    </form>
  );
}
