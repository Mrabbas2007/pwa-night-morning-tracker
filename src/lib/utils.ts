import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNum(str: string | number, lang: 'fa' | 'en' = 'fa'): string {
  if (lang === 'en') return str.toString();
  return str.toString().replace(/\d/g, x => PERSIAN_DIGITS[parseInt(x)]);
}
