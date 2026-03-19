import app from "./app.js";
import { seedAdmin } from "./lib/adminSeed.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Seed admin account from env vars on startup
seedAdmin().catch(console.error);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
