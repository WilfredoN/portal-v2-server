import type { Context, Next } from 'hono'
import type { AppError } from './app-error'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export const errorHandler = () => {
  return async (context: Context, next: Next) => {
    try {
      await next()
    } catch (error) {
      if (error && typeof error === 'object' && 'isApplicationError' in error) {
        const appError = error as AppError

        return context.json(
          {
            code: appError.code,
            message: appError.message,
            details: appError.details ?? undefined
          },
          appError.status as ContentfulStatusCode
        )
      }

      console.error('Unhandled error:', error)

      return context.json(
        {
          code: 'internal/server-error',
          message: 'Internal Server Error'
        },
        500
      )
    }
  }
}
