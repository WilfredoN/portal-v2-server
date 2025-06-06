import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',

  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/postgres'
  },

  schemaFilter: 'public',

  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public'
  }
})
