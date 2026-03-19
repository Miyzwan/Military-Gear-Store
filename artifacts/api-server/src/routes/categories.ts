import { Router, type IRouter } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import {
  CreateCategoryBody,
  UpdateCategoryParams,
  UpdateCategoryBody,
  DeleteCategoryParams,
} from "@workspace/api-zod";
import { eq, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        description: categoriesTable.description,
        slug: categoriesTable.slug,
        imageUrl: categoriesTable.imageUrl,
        productCount: sql<number>`COUNT(${productsTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(categoriesTable.id, productsTable.categoryId))
      .groupBy(categoriesTable.id);

    res.json(categories);
  } catch (error) {
    console.error("[categories GET /]", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin-protected ───────────────────────────────────────────────────────────
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = CreateCategoryBody.parse(req.body);
    const [category] = await db
      .insert(categoriesTable)
      .values({
        name: body.name,
        description: body.description ?? null,
        slug: body.slug,
        imageUrl: body.imageUrl ?? null,
      })
      .returning();

    res.status(201).json({ ...category, productCount: 0 });
  } catch (error) {
    console.error("[categories POST /]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateCategoryParams.parse(req.params);
    const body = UpdateCategoryBody.parse(req.body);

    const [category] = await db
      .update(categoriesTable)
      .set({
        name: body.name,
        description: body.description ?? null,
        slug: body.slug,
        imageUrl: body.imageUrl ?? null,
      })
      .where(eq(categoriesTable.id, id))
      .returning();

    if (!category) return res.status(404).json({ error: "Category not found" });

    const productCount = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.categoryId, id))
      .then((r) => r[0]?.count ?? 0);

    res.json({ ...category, productCount });
  } catch (error) {
    console.error("[categories PUT /:id]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = DeleteCategoryParams.parse(req.params);
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.status(204).end();
  } catch (error) {
    console.error("[categories DELETE /:id]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
