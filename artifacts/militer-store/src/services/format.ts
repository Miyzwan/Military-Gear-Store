/**
 * services/format.ts
 *
 * Shared formatting utilities for the frontend.
 * Keeps formatting logic out of components.
 */

/**
 * Format a price number as Indonesian Rupiah.
 * e.g. 150000 → "Rp 150.000"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date as a short Indonesian locale string.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Truncate a string to a given length and append "…".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
