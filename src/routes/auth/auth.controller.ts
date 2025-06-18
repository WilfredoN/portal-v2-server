import type { Context } from 'hono'

import { generateToken } from '@src/lib/jwt'
import { logger } from '@src/lib/logger'

import { authService } from './auth.service'

export const authController = {
  async login(content: Context): Promise<Response> {
    const body = await content.req.json()
    logger.info('Login attempt', { email: body.email })
    try {
      const result = await authService.login(body)
      logger.info('Login successful', { userId: result.id, email: result.email })
      const token = await generateToken({
        id: result.id,
        email: result.email,
        role: result.role,
      })
      content.header(
        'Set-Cookie',
        `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
      )
      return content.json({ ...result, token })
    } catch (error) {
      logger.error('Login failed', { email: body.email, error })
      throw error
    }
  },

  async signUp(content: Context): Promise<Response> {
    const body = await content.req.json()
    logger.info('Sign up attempt', { email: body.email })
    try {
      const result = await authService.signUp(body)
      logger.info('Sign up successful', { userId: result.id, email: result.email })
      return content.json(result)
    } catch (error) {
      logger.error('Sign up failed', { email: body.email, error })
      throw error
    }
  },

  async logout(content: Context) {
    logger.info('Logout attempt')
    content.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    logger.info('Logout successful')
    return content.json({ message: 'Logged out' })
  },
}
