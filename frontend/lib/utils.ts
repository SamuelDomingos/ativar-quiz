import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

export function getTimeColor(seconds: number, total: number): string {
  if (total === 0) return "text-foreground";
  const ratio = seconds / total;
  if (ratio > 0.5) return "text-green-500";
  if (ratio > 0.25) return "text-amber-500";
  return "text-red-500";
}