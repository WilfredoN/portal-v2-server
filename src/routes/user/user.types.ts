import type { z } from 'zod'
import type {
  UserRoleSchema,
  UserSchema,
  UserStatusSchema
} from './user.schema'

export type User = z.infer<typeof UserSchema>
export type UserStatus = z.infer<typeof UserStatusSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
