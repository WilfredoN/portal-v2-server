import type { z } from 'zod'
import type { LoginSchema, SignUpSchema } from './auth.schema'

export type SignUpDTO = z.infer<typeof SignUpSchema>
export type LoginDTO = z.infer<typeof LoginSchema>
