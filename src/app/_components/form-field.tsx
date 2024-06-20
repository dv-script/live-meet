import { Input } from "@ui/input";
import { Label } from "./ui/label";

interface FormFieldProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  defaultValue?: string | number;
  errorMessages?: string[];
}

export function FormField({
  label,
  name,
  placeholder,
  type,
  defaultValue,
  errorMessages,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={
          errorMessages && errorMessages.length > 0 ? "border-red-500" : ""
        }
      />
      {errorMessages &&
        errorMessages.map((error, index) => (
          <p key={index} className="text-xs text-red-500" aria-live="polite">
            {error}
          </p>
        ))}
    </div>
  );
}
