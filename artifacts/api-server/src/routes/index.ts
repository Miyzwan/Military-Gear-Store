import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import settingsRouter from "./settings.js";

const router: IRouter = Router();

// ── Utilities ─────────────────────────────────────────────────────────────────
router.use(healthRouter);

// ── Auth (public) ─────────────────────────────────────────────────────────────
// POST /api/auth/login  POST /api/auth/logout  GET /api/auth/me
router.use("/auth", authRouter);

// ── Products ──────────────────────────────────────────────────────────────────
// GET is public. POST/PUT/DELETE are protected inside productsRouter.
router.use("/products", productsRouter);

// ── Categories ────────────────────────────────────────────────────────────────
// GET is public. POST/PUT/DELETE are protected inside categoriesRouter.
router.use("/categories", categoriesRouter);

// ── Settings ──────────────────────────────────────────────────────────────────
// GET is public. PUT is protected inside settingsRouter.
router.use("/settings", settingsRouter);

// ── Subdomain note ────────────────────────────────────────────────────────────
// To split admin to a separate subdomain later:
//   1. Move /auth + write routes to a new Express app (admin.warzone.id)
//   2. Keep only public GET routes on the storefront origin
//   3. Update CORS origin to allow admin.warzone.id

export default router;
