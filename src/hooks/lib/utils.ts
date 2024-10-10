import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function NaNToZero(value: number): number {
  return isNaN(value) ? 0 : value;
}
