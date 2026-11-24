import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes("username:password")) {
  console.warn(
    "\n⚠️  DATABASE_URL belum dikonfigurasi.\n" +
    "   Buka file .env.local dan isi DATABASE_URL dengan Neon connection string.\n" +
    "   Lalu jalankan: npm run db:push && npm run db:seed\n"
  );
}

// Fallback agar tidak crash saat development sebelum DB dikonfigurasi
const connectionString = (dbUrl && !dbUrl.includes("username:password"))
  ? dbUrl
  : "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder?sslmode=require";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export type DB = typeof db;
