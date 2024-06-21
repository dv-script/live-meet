import { Location } from "@prisma/client";

export interface LocationsOptions {
  value: Location;
  name: string;
}

export const locations: LocationsOptions[] = [
  { value: "ANDAR1", name: "1° Andar" },
  { value: "ANDAR2", name: "2° Andar" },
  { value: "ANDAR3", name: "3° Andar" },
  { value: "ANDAR4", name: "4° Andar" },
  { value: "ANDAR5", name: "5° Andar" },
];

export function locationValidation(location: string) {
  switch (location) {
    case "1° Andar":
      return "ANDAR1";
    case "2° Andar":
      return "ANDAR2";
    case "3° Andar":
      return "ANDAR3";
    case "4° Andar":
      return "ANDAR4";
    case "5° Andar":
      return "ANDAR5";
  }
}

export function getLocationName(location: Location) {
  switch (location) {
    case "ANDAR1":
      return "1° Andar";
    case "ANDAR2":
      return "2° Andar";
    case "ANDAR3":
      return "3° Andar";
    case "ANDAR4":
      return "4° Andar";
    case "ANDAR5":
      return "5° Andar";
  }
}
