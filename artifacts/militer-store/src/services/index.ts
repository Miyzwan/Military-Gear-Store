/**
 * services/index.ts
 *
 * Central export for all service-layer helpers.
 * Components should import from here rather than from individual service files.
 *
 * @example
 *   import { formatPrice, buildWhatsAppUrl, apiFetch } from "@/services"
 */
export * from "./api";
export * from "./format";
export * from "./whatsapp";
