"use client";

import { editMyProfile } from "@/app/_actions/edit-my-profile";
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
import { departments, getDeparmentName } from "@/app/_utils/departments";
import { Department, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function MyAccountForm({
  user,
}: {
  user: Prisma.UserGetPayload<{ select: { name: true; department: true } }>;
}) {
  const initialState = { errors: {}, message: "" };
  const [state, dispatch] = useFormState(editMyProfile, initialState);

  const departmentName = getDeparmentName(user.department);
  const [selectedDeparment, setSelectedDepartment] = useState(departmentName);

  function handleDepartmentChange(department: Department) {
    setSelectedDepartment(department);
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }

    if (!state.success && state.message) {
      toast.error(state.message);
      state.message = "";
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col gap-3">
      <FormField
        label="Nome"
        name="name"
        placeholder="Insira seu nome completo"
        defaultValue={user.name}
      />
      <div className="flex flex-col gap-1">
        <Label>Time</Label>
        <Select
          name="department"
          defaultValue={departmentName}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o time que pertence">
              {selectedDeparment}
            </SelectValue>
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
      </div>
      <SubmitButton>Salvar alterações</SubmitButton>
    </form>
  );
}
