import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple UUID generator for mock data
export function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to convert duration from days/hours/minutes to seconds
export function getDurationInSeconds(days: string, hours: string, minutes: string): bigint{
    const d = parseInt(days || "0");
    const h = parseInt(hours || "0");
    const m = parseInt(minutes || "0");
    return BigInt(d * 86400 + h * 3600 + m * 60);
  };

//Helper function to convert seconds into days/hours/minutes
export function formatDuration(seconds?: number) {
    if (!seconds || isNaN(seconds)) return "-";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return (
      [
        d > 0 ? `${d} Days ` : null,
        h > 0 ? `${h} Hours ` : null,
        m > 0 ? `${m} Minutes` : null,
      ]
        .filter(Boolean)
        .join(" ") || "0m"
    );
  }