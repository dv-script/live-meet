import { Role } from "@prisma/client";

export interface RolesOptions {
  value: Role;
  name: string;
}

export const roles: RolesOptions[] = [
  { value: "ADMIN", name: "Administrador" },
  { value: "USER", name: "Usuário" },
];

export function roleValidation(role: string) {
  switch (role) {
    case "Administrador":
      return "ADMIN";
    case "Usuário":
      return "USER";
  }
}

export function getRoleName(role: Role) {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "USER":
      return "Usuário";
  }
}
