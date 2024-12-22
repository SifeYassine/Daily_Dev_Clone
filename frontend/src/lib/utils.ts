import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Env from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image: string) {
  return `${Env.API_URL}/storage/${image}`;
}
