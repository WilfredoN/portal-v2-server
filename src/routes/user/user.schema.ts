import { z } from 'zod'

export const UserStatusSchema = z.enum([
  'new',
  'verified',
  'active',
  'suspended',
  'deleted'
])

export const UserRoleSchema = z.enum([
  'superadmin',
  'admin',
  'enterprise_customer',
  'selfserve_customer',
  'sdk_partner'
])

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  status: UserStatusSchema.default('new'),
  role: UserRoleSchema.nullable()
})
