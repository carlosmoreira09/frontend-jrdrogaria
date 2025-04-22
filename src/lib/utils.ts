import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const storeOptions = [
  { id: 1, name: 'JR - Matriz', disable: false},
  { id: 2, name: 'GS Perfumaria',disable: false },
  { id: 4, name: 'JR - Filial Barão',disable: false },
  { id: 3, name: 'GS Drogaria',disable: false },
];