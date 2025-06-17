import { z } from 'zod'

export const SignUpSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  password: z.string().min(8)
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const AuthSchema = z.object({
  id: z.string(),
  userId: z.string(),
  identifier: z.string(),
  createdAt: z.date(),
  provider: z.string(),
  password: z.string().optional()
})
