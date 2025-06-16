import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { appError } from '@src/lib/errors/app-error'

const extractToken = (context: Context): string | undefined => {
  const header = context.req.header('Authorization')
  let token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    const cookie = context.req.header('Cookie')
    token = cookie?.match(/token=([^;]+)/)?.[1]
  }

  return token
}

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
