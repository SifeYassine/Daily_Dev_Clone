import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Env from "./env";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image: string) {
  return `${Env.API_URL}/storage/${image}`;
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function formatDate(date: string) {
  return moment(date).format("DD MMM YYYY");
}
