import { Department } from "@prisma/client";

export interface DepartmentOption {
  value: Department;
  name: string;
}

export const departments: DepartmentOption[] = [
  { value: "COMERCIAL", name: "Comercial" },
  { value: "FINANCEIRO", name: "Financeiro" },
  { value: "CONTEUDO", name: "Tranmissão e Conteúdo" },
  { value: "OPERACOES", name: "Engenharia e Operações" },
  { value: "RH", name: "Recursos Humanos" },
  { value: "DIREITOS", name: "Direitos" },
  { value: "ENTIDADES", name: "Entidades Esportivas" },
  { value: "NEGOCIOS", name: "Novos Negócios" },
];

export function departmentValidation(department: string) {
  switch (department) {
    case "Comercial":
      return "COMERCIAL";
    case "Financeiro":
      return "FINANCEIRO";
    case "Tranmissão e Conteúdo":
      return "CONTEUDO";
    case "Engenharia e Operações":
      return "OPERACOES";
    case "Recursos Humanos":
      return "RH";
    case "Direitos":
      return "DIREITOS";
    case "Entidades Esportivas":
      return "ENTIDADES";
    case "Novos Negócios":
      return "NEGOCIOS";
  }
}
