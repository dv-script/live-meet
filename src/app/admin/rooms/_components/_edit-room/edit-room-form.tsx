"use client";

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
import { Location, Room } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { getLocationName, locations } from "@/app/_utils/locations";
import { editRoom } from "@/app/_actions/edit-room";
import { FormError } from "@/app/_components/form-error";

export function EditRoomForm({
  room,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: Room;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(editRoom, initialState);

  const roomLocationName = getLocationName(room.location);
  const [selectedLocation, setSelectedLocation] = useState(roomLocationName);

  const handleLocationChange = (value: Location) => {
    setSelectedLocation(value);
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
      <input type="hidden" name="id" value={room.id} />
      <FormField
        label="Nome da sala"
        name="name"
        placeholder="Insira o nome da sala de reunião"
        defaultValue={room.name}
        errorMessages={state.errors?.name}
      />
      <FormField
        label="Capacidade máxima"
        name="capacity"
        type="number"
        placeholder="Insira a capacidade máxima da sala de reunião"
        defaultValue={room.capacity}
        errorMessages={state.errors?.capacity}
      />

      <div className="flex flex-col gap-3">
        <Label>Localização</Label>
        <div className="flex flex-col gap-2">
          <Select
            name="location"
            defaultValue={roomLocationName}
            onValueChange={handleLocationChange}
          >
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
      {state.message && !state.success && (
        <FormError errorMessage={state.message} />
      )}
      <div className="flex justify-end">
        <SubmitButton className="w-fit">Salvar alterações</SubmitButton>
      </div>
    </form>
  );
}
