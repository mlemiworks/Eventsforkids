// prisma.config.ts
// This file configures the Prisma CLI (for running migrations, Prisma Studio, etc.)
// It is NOT used at runtime — that's handled separately in src/lib/prisma.ts.
// We import dotenv/config so it can read our .env file.
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // DIRECT_URL = the non-pooled connection string.
  // Migrations need a direct connection because they run DDL commands
  // (CREATE TABLE etc.) that don't work through Supabase's connection pooler.
  datasource: {
    url: env('DIRECT_URL'),
  },
});
