import type { ZodSchema } from 'zod'

import { appError } from '@src/lib/errors/app-error'
import { ZodError } from 'zod'

export const validateSchema = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw appError('validation/failed', 400, error.issues)
    }
    throw error
  }
}
