import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random UUID version 4 string.
 *
 * The returned string follows the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, where each `x` and `y` is replaced with a random hexadecimal digit according to UUID v4 specifications.
 *
 * @returns A randomly generated UUID v4 string
 */
export function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
   * Converts days, hours, and minutes (as strings) into a total duration in seconds.
   *
   * Parses each input string as an integer (defaulting to 0 if empty), calculates the total number of seconds, and returns the result as a bigint.
   *
   * @param days - Number of days as a string
   * @param hours - Number of hours as a string
   * @param minutes - Number of minutes as a string
   * @returns The total duration in seconds as a bigint
   */
export function getDurationInSeconds(days: string, hours: string, minutes: string): bigint{
    const d = parseInt(days || "0");
    const h = parseInt(hours || "0");
    const m = parseInt(minutes || "0");
    return BigInt(d * 86400 + h * 3600 + m * 60);
  };

/**
   * Formats a duration in seconds into a human-readable string with days, hours, and minutes.
   *
   * Returns "-" if the input is missing or not a valid number. Only non-zero units are included in the output, or "0m" if all are zero.
   *
   * @param seconds - The duration in seconds to format
   * @returns A string representing the duration in days, hours, and minutes
   */
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