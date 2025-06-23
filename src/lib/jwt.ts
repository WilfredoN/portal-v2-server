import type { JWTPayload } from '@src/types/context'

import { sign, verify } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

export const JWT_EXPIRE_TIME_SECONDS = 60 * 60

export const generateToken = async (
  payload: Omit<JWTPayload, 'exp' | 'iat'>
) => {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + JWT_EXPIRE_TIME_SECONDS

  return sign(
    {
      ...payload,
      iat: issuedAt,
      exp: expiresAt
    },
    JWT_SECRET
  )
}
const isJWTPayload = (payload: unknown): payload is JWTPayload => {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  const { sub, iat, exp } = payload as Partial<JWTPayload>

  return (
    typeof sub === 'string'
    && typeof iat === 'number'
    && typeof exp === 'number'
  )
}

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const payload = await verify(token, JWT_SECRET)

  if (!isJWTPayload(payload)) {
    throw new Error('Invalid JWT payload structure')
  }

  return payload
}
