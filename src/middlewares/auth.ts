import type { Context, Next } from 'hono'

import { appError } from '@src/lib/errors/app-error'
import { logger } from '@src/lib/logger'
import { extractToken } from '@src/lib/shared/jwt'
import { verify } from 'hono/jwt'

export const authMiddleware = () => {
  return async (context: Context, next: Next) => {
    const token = extractToken(context)

    if (!token) {
      throw appError('auth/unauthorized', 401)
    }
    try {
      const payload = await verify(token, process.env.JWT_SECRET!)
      context.set('user', payload)
      await next()
    } catch (error) {
      logger.error('JWT verification failed:', error)
      throw appError('auth/unauthorized', 401)
    }
  }
}
