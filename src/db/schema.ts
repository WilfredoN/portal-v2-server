import { pgTable, pgEnum, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const userStatusEnum = pgEnum('user_status', [
  'new',
  'verified',
  'active',
  'suspended',
  'deleted'
])

export const userRoleEnum = pgEnum('user_role', [
  'superadmin',
  'admin',
  'enterprise_customer',
  'selfserve_customer',
  'sdk_partner'
])

export const auth = pgTable('auth', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  provider: varchar('provider', { length: 255 }).notNull()
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  status: userStatusEnum('status').notNull().default('new')
})
