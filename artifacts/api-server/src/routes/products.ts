import { Router, type IRouter } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  GetProductsQueryParams,
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
} from "@workspace/api-zod";
import { eq, and, ilike } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const query = GetProductsQueryParams.parse(req.query);
    const conditions = [];
    if (query.categoryId !== undefined) conditions.push(eq(productsTable.categoryId, query.categoryId));
    if (query.search) conditions.push(ilike(productsTable.name, `%${query.search}%`));
    if (query.featured !== undefined) conditions.push(eq(productsTable.featured, query.featured));

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        stock: productsTable.stock,
        featured: productsTable.featured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(products.map((p) => ({ ...p, price: Number(p.price) })));
  } catch (error) {
    console.error("[products GET /]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse(req.params);
    const [product] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        stock: productsTable.stock,
        featured: productsTable.featured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ ...product, price: Number(product.price) });
  } catch (error) {
    console.error("[products GET /:id]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

// ── Admin-protected ───────────────────────────────────────────────────────────
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db
      .insert(productsTable)
      .values({
        name: body.name,
        description: body.description,
        price: String(body.price),
        imageUrl: body.imageUrl ?? null,
        categoryId: body.categoryId ?? null,
        stock: body.stock,
        featured: body.featured ?? false,
        isActive: body.isActive ?? true,
      })
      .returning();

    const category = product.categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).then((r) => r[0])
      : null;

    res.status(201).json({ ...product, price: Number(product.price), categoryName: category?.name ?? null });
  } catch (error) {
    console.error("[products POST /]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse(req.params);
    const body = UpdateProductBody.parse(req.body);

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const [product] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const category = product.categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).then((r) => r[0])
      : null;

    res.json({ ...product, price: Number(product.price), categoryName: category?.name ?? null });
  } catch (error) {
    console.error("[products PUT /:id]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse(req.params);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).end();
  } catch (error) {
    console.error("[products DELETE /:id]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
