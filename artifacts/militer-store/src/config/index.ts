/**
 * config/index.ts
 *
 * Frontend configuration constants.
 * All values are either static or derived from import.meta.env (Vite env vars).
 * Never put secrets here.
 */

/** Default store name shown while settings load from the API. */
export const DEFAULT_STORE_NAME = "WARZONE TACTICAL";

/** Placeholder image path for products with no image. */
export const PLACEHOLDER_IMAGE = "/images/placeholder-product.png";

/** Admin route prefix. */
export const ADMIN_ROUTE_PREFIX = "/admin";

/** Product categories that appear in the navigation. */
export const NAV_CATEGORIES = [
  { label: "Seragam & PDL", href: "/produk?category=seragam" },
  { label: "Helm & Pelindung", href: "/produk?category=helm" },
  { label: "Tas & Ransel", href: "/produk?category=tas" },
  { label: "Senjata Replica", href: "/produk?category=senjata" },
  { label: "Aksesori", href: "/produk?category=aksesori" },
  { label: "Boots & Alas Kaki", href: "/produk?category=boots" },
] as const;

/** Product sort options for the catalog page. */
export const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga: Rendah → Tinggi" },
  { value: "price_desc", label: "Harga: Tinggi → Rendah" },
  { value: "name_asc", label: "Nama: A → Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
