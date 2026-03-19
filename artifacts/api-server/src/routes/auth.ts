import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

/**
 * POST /api/auth/login
 * Verifies credentials and creates an admin session.
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = AdminLoginBody.parse(req.body);

    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.username, username))
      .limit(1);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: "Username atau password salah." });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Username atau password salah." });
    }

    req.session.adminId = admin.id;
    req.session.username = admin.username;

    res.json({
      success: true,
      admin: { id: admin.id, username: admin.username, isActive: admin.isActive },
    });
  } catch (error) {
    console.error("[auth/login]", error);
    res.status(400).json({ error: "Bad request" });
  }
});

/**
 * POST /api/auth/logout
 * Destroys the current admin session.
 */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("warzone.sid");
    res.json({ message: "Berhasil logout." });
  });
});

/**
 * GET /api/auth/me
 * Returns the current authenticated admin. 401 if not logged in.
 */
router.get("/me", requireAdmin, async (req, res) => {
  try {
    const [admin] = await db
      .select({ id: adminsTable.id, username: adminsTable.username, isActive: adminsTable.isActive })
      .from(adminsTable)
      .where(eq(adminsTable.id, req.session.adminId!))
      .limit(1);

    if (!admin) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session tidak valid." });
    }

    res.json(admin);
  } catch (error) {
    console.error("[auth/me]", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
