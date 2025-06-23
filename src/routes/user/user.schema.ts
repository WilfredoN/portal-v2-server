import { email, firstName, lastName } from '@shared/schema'
import { ROLES } from '@src/lib/shared/roles'
import { z } from 'zod'

export const userStatusSchema = z.enum([
  'new',
  'verified',
  'active',
  'suspended',
  'deleted'
])

export const userRoleSchema = z.enum(ROLES)

export const userSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format.' }),
  email,
  firstName,
  lastName,
  status: userStatusSchema.default('new'),
  role: userRoleSchema.nullable()
})

export type UserDTO = z.infer<typeof userSchema>
export type UserStatusDTO = z.infer<typeof userStatusSchema>
export type UserRoleDTO = z.infer<typeof userRoleSchema>
