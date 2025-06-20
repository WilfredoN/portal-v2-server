import type { Context, Next } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import type { AppError } from './app-error'

import { logger } from '../logger'
import { error } from '../shared/response'

export const errorHandler = () => {
  return async (context: Context, next: Next) => {
    try {
      await next()
    } catch (err) {
      if (err && typeof err === 'object' && 'isApplicationError' in err) {
        const appError = err as AppError
        const status = (appError.status as ContentfulStatusCode) || 500
        const code = status

        return context.json(
          error(
            code,
            appError.message || 'Application Error',
            appError.details ?? undefined,
            appError.code,
            undefined,
            { req: { path: context.req.path } },
          ),
          status,
        )
      }

      logger.error('Unhandled error:', err)
      const code: ContentfulStatusCode = 500
      return context.json(
        error(
          code,
          'Internal Server Error',
          undefined,
          undefined,
          undefined,
          { req: { path: context.req.path } },
        ),
        code,
      )
    }
  }
}
