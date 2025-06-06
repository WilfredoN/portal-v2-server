import { pgTable, pgEnum, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const userStatusEnum = pgEnum('user_status', [
  'new',
  'verified',
  'active',
  'suspended',
  'deleted'
])

export const auth = pgTable('auth', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  signedInAt: timestamp('signed_in_at', { withTimezone: true }),
  provider: varchar('provider', { length: 255 }).notNull(),
  identifier: varchar('identifier', { length: 255 })
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  status: userStatusEnum('status').notNull().default('new')
})
