import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {storeBarao, storeGR, storeJR, storeLB} from "./database.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const storeOptions = [
  { id: 1, name: 'JR', connection: storeJR, disable: false},
  { id: 2, name: 'GR', connection: storeGR ,disable: false },
  { id: 3, name: 'Barão', connection: storeBarao ,disable: false },
  { id: 4, name: 'LB', connection: storeLB,disable: false },
];