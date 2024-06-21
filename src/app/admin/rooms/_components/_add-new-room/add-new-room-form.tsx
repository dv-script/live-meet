"use client";

import { addNewRoom } from "@/app/_actions/add-new-room";
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
import { locations } from "@/app/_utils/locations";
import React, { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function AddNewRoomForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(addNewRoom, initialState);

  const [selectedLocation, setSelectedLocation] = useState("");

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
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
        label="Nome da sala"
        name="name"
        placeholder="Insira o nome da sala de reunião"
        errorMessages={state.errors?.name}
      />
      <FormField
        label="Capaciade máxima"
        name="capacity"
        type="number"
        placeholder="Insira a capacidade máxima da sala de reunião"
        errorMessages={state.errors?.capacity}
      />
      <div className="flex flex-col gap-3">
        <Label>Localização</Label>
        <div className="flex flex-col gap-2">
          <Select name="location" onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue>{selectedLocation}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem
                  className="cursor-pointer"
                  value={location.name}
                  key={location.value}
                >
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.location &&
            state.errors.location.map((error) => (
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
          Criar sala de reunião
        </SubmitButton>
      </div>
    </form>
  );
}
