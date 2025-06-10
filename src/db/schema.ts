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

export const permissionsEnum = pgEnum('permissions', [
  'create',
  'view',
  'edit',
  'delete'
])

export const resourcesEnum = pgEnum('resources', [
  'users',
  'plans',
  'residential_plans',
  'isp_plans',
  'serp_plans'
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
  provider: varchar('provider', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 })
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  status: userStatusEnum('status').notNull().default('new'),
  role: userRoleEnum('role')
})

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  permission: permissionsEnum('permission').notNull(),
  resourcesEnum: resourcesEnum('resource').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull()
})
