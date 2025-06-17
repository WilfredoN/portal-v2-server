import type { z } from 'zod'
import type { loginSchema, signUpSchema } from './auth.schema'

export type SignUpDTO = z.infer<typeof signUpSchema>
export type LoginDTO = z.infer<typeof loginSchema>
