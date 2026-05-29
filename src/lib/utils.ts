import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function getGreeting(name: string, isFa: boolean): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return isFa ? `صبح بخیر، ${name}` : `Good morning, ${name}`;
  } else if (hour >= 12 && hour < 17) {
    return isFa ? `ظهر بخیر، ${name}` : `Good afternoon, ${name}`;
  } else if (hour >= 17 && hour < 21) {
    return isFa ? `عصر بخیر، ${name}` : `Good evening, ${name}`;
  } else {
    return isFa ? `شب بخیر، ${name}` : `Good night, ${name}`;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNum(str: string | number, lang: 'fa' | 'en' = 'fa'): string {
  if (lang === 'en') return str.toString();
  return str.toString().replace(/\d/g, x => PERSIAN_DIGITS[parseInt(x)]);
}
