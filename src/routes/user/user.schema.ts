import { z } from 'zod'
import { email, firstName, lastName } from '@shared/schema'

export const userStatusSchema = z.enum([
  'new',
  'verified',
  'active',
  'suspended',
  'deleted'
])

export const userRoleSchema = z.enum([
  'superadmin',
  'admin',
  'enterprise_customer',
  'selfserve_customer',
  'sdk_partner'
])

export const userSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format.' }),
  email: email,
  firstName: firstName,
  lastName: lastName,
  status: userStatusSchema.default('new'),
  role: userRoleSchema.nullable()
})
