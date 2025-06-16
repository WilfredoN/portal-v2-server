import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

export const authMiddleware = () => {
  return async (context: Context, next: Next) => {
    const header = context.req.header('Authorization')

    if (!header || !header.startsWith('Bearer ')) {
      return context.json({ message: 'Unauthorized' }, 401)
    }
    const token = header.slice(7)
    try {
      const payload = await verify(token, process.env.JWT_SECRET!)
      context.set('user', payload)
      await next()
    } catch (error) {
      console.error('JWT verification failed:', error)

      return context.json({ message: 'Unauthorized' }, 401)
    }
  }
}
