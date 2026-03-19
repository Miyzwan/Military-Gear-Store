import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storeSettingsTable = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull().default("Toko Militer Indonesia"),
  storeDescription: text("store_description"),
  whatsappNumber: text("whatsapp_number").notNull().default("6281234567890"),
  heroTitle: text("hero_title").notNull().default("Perlengkapan Militer Terbaik"),
  heroSubtitle: text("hero_subtitle"),
  heroImageUrl: text("hero_image_url"),
  logoUrl: text("logo_url"),
  address: text("address"),
  email: text("email"),
  operatingHours: text("operating_hours"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettingsTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettingsTable.$inferSelect;
