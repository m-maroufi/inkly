import { Pool } from "pg";
import { env } from "../config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

const pool = new Pool({
  connectionString: env.databaseUrl,
});

export const db = drizzle({
  client: pool,
});

export { pool };

// checking connection
export async function checkDatabaseConnection() {
  await db.execute(sql`SELECT 1`);
}
