import { appError } from '@src/lib/errors/app-error'
import { ZodError, type ZodSchema } from 'zod'

export const validateSchema = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw appError('validation/failed', undefined, 400, error.issues)
    }
    throw error
  }
}
