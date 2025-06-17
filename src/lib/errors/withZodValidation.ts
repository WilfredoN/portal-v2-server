import { ZodError, type ZodSchema } from 'zod'
import { appError } from '@src/lib/errors/app-error'

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
