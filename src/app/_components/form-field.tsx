import { Input } from "@ui/input";
import { Label } from "./ui/label";

interface FormFieldProps {
  label: string;
  errorMessages?: string[];
}

export function FormField({
  label,
  errorMessages,
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        {...props}
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
