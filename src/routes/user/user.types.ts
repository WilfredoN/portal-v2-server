import type { z } from 'zod'
import type {
  userRoleSchema,
  userSchema,
  userStatusSchema
} from './user.schema'

export type UserDTO = z.infer<typeof userSchema>
export type UserStatusDTO = z.infer<typeof userStatusSchema>
export type UserRoleDTO = z.infer<typeof userRoleSchema>
