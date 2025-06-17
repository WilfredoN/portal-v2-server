import type { z } from 'zod'
import type {
  LoginSchema,
  SignUpSchema,
  UserRoleSchema,
  UserSchema,
  UserStatusSchema
} from './user.schema'

export type SignUpDTO = z.infer<typeof SignUpSchema>
export type LoginDTO = z.infer<typeof LoginSchema>
export type User = z.infer<typeof UserSchema>
export type UserStatus = z.infer<typeof UserStatusSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
