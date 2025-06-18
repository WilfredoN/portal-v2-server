import { email, firstName, lastName, password } from '@shared/schema'
import { z } from 'zod'

export const loginSchema = z.object({
  email,
  password,
})

export const signUpSchema = z.object({
  email,
  password,
  firstName,
  lastName,
})

export const AuthSchema = z.object({
  id: z.string(),
  userId: z.string(),
  identifier: z.string(),
  createdAt: z.date(),
  provider: z.string(),
  password: z.string().optional(),
})

export type SignUpDTO = z.infer<typeof signUpSchema>
export type LoginDTO = z.infer<typeof loginSchema>
