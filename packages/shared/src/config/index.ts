/**
 * @workspace/shared — Shared configuration constants
 *
 * All values come from environment variables or safe defaults.
 * Never put secrets here — use process.env directly on the server.
 */

/** Default store name shown in the UI before settings are loaded. */
export const DEFAULT_STORE_NAME = "WARZONE TACTICAL";

/** Fallback placeholder image when a product has no image. */
export const PLACEHOLDER_IMAGE = "/images/placeholder-product.png";

/** Session cookie name (must match the api-server config). */
export const SESSION_COOKIE_NAME = "warzone.sid";

/** Admin route prefix. */
export const ADMIN_ROUTE_PREFIX = "/admin";

/** Public API route prefix. */
export const API_PREFIX = "/api";

/** Supported product sort options. */
export const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price_desc", label: "Harga: Tinggi ke Rendah" },
  { value: "name_asc", label: "Nama: A–Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
