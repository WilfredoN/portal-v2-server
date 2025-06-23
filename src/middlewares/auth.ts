import type { AppContext } from '@src/types/context'
import type { MiddlewareHandler } from 'hono'

import { appError } from '@src/lib/errors/app-error'
import { verifyToken } from '@src/lib/jwt'
import { logger } from '@src/lib/logger'
import { bearerAuth } from 'hono/bearer-auth'

export const jwtMiddleware: MiddlewareHandler<AppContext> = bearerAuth({
  verifyToken: async (token, c) => {
    logger.debug('Verifying JWT token')
    try {
      const payload = await verifyToken(token)

      logger.debug('JWT token verified successfully', { sub: payload.sub })
      c.set('jwtPayload', payload)
    } catch (error) {
      const errorMessage
        = error instanceof Error ? error.message : 'Unknown error occurred'
      logger.fatal('JWT verification failed:', errorMessage)
      throw appError('auth/unauthorized', 401, errorMessage)
    }

    return true
  }
})
