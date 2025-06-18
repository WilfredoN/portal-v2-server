import { sign } from 'hono/jwt'

export const JWT_EXPIRE_TIME = 60 * 60

export const generateToken = async (payload: {
  id: string
  email: string
  role: string | null
}) => {
  return await sign(
    {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
      exp: Math.floor(Date.now() / 1000) + JWT_EXPIRE_TIME,
    },
    process.env.JWT_SECRET!,
  )
}
