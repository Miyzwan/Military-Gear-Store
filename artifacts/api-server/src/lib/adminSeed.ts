import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Seeds the initial admin account from environment variables on startup.
 * ADMIN_USERNAME and ADMIN_PASSWORD control the credentials.
 * If the admin already exists, it updates the password if it changed.
 */
export async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn(
      "[adminSeed] ADMIN_USERNAME or ADMIN_PASSWORD not set — skipping admin seed"
    );
    return;
  }

  try {
    const existing = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.username, username))
      .limit(1);

    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash(password, 12);
      await db.insert(adminsTable).values({
        username,
        passwordHash,
        isActive: true,
      });
      console.log(`[adminSeed] Admin account '${username}' created.`);
    } else {
      // Update the hash in case the password env var changed
      const valid = await bcrypt.compare(password, existing[0].passwordHash);
      if (!valid) {
        const passwordHash = await bcrypt.hash(password, 12);
        await db
          .update(adminsTable)
          .set({ passwordHash, updatedAt: new Date() })
          .where(eq(adminsTable.username, username));
        console.log(`[adminSeed] Admin account '${username}' password updated.`);
      } else {
        console.log(`[adminSeed] Admin account '${username}' already exists.`);
      }
    }
  } catch (err) {
    console.error("[adminSeed] Failed to seed admin:", err);
  }
}
