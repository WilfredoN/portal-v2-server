import type { Context } from 'hono'

export const extractToken = (context: Context): string | undefined => {
  const header = context.req.header('Authorization')
  let token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    const cookie = context.req.header('Cookie')
    token = cookie?.match(/token=([^;]+)/)?.[1]
  }

  return token
}
