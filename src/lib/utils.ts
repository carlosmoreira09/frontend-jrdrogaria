import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const storeOptions = [
  { id: 1, name: 'JR', disable: false},
  { id: 2, name: 'GS',disable: false },
  { id: 4, name: 'Barão',disable: false },
  { id: 3, name: 'LB',disable: false },
];