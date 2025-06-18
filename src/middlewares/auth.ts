import type { Context, Next } from 'hono'

import { appError } from '@src/lib/errors/app-error'
import { extractToken } from '@src/lib/shared/jwt'
import { verify } from 'hono/jwt'

export const authMiddleware = () => {
  return async (context: Context, next: Next) => {
    const token = extractToken(context)

    if (!token) {
      throw appError('auth/unauthorized', 'Unauthorized', 401)
    }
    try {
      const payload = await verify(token, process.env.JWT_SECRET!)
      context.set('user', payload)
      await next()
    } catch (error) {
      console.error('JWT verification failed:', error)
      throw appError('auth/unauthorized', 'Unauthorized', 401)
    }
  }
}
