import { Router, type IRouter } from "express";
import { db, storeSettingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function ensureSettings() {
  const existing = await db.select().from(storeSettingsTable).limit(1);
  if (existing.length === 0) {
    const [created] = await db
      .insert(storeSettingsTable)
      .values({
        storeName: "WARZONE TACTICAL",
        storeDescription: "Perlengkapan militer dan seragam TNI/Polri terlengkap di Indonesia",
        whatsappNumber: "6281234567890",
        heroTitle: "Dominasi Setiap Misi dengan Perlengkapan Elite",
        heroSubtitle: "Seragam dan perlengkapan militer berkualitas tinggi untuk TNI, Polri, dan pecinta tactical gear",
        address: "Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta",
        email: "info@warzonetactical.id",
        operatingHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
      })
      .returning();
    return created;
  }
  return existing[0];
}

router.get("/", async (_req, res) => {
  try {
    const settings = await ensureSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const body = UpdateSettingsBody.parse(req.body);
    const settings = await ensureSettings();

    const updateData: Record<string, unknown> = {};
    if (body.storeName !== undefined) updateData.storeName = body.storeName;
    if (body.storeDescription !== undefined) updateData.storeDescription = body.storeDescription;
    if (body.whatsappNumber !== undefined) updateData.whatsappNumber = body.whatsappNumber;
    if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updateData.heroSubtitle = body.heroSubtitle;
    if (body.heroImageUrl !== undefined) updateData.heroImageUrl = body.heroImageUrl;
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.operatingHours !== undefined) updateData.operatingHours = body.operatingHours;
    updateData.updatedAt = new Date();

    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(storeSettingsTable)
      .set(updateData)
      .where(eq(storeSettingsTable.id, settings.id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
