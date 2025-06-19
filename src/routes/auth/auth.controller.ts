import type { Context } from 'hono'

import { logger } from '@src/lib/logger'
import { success } from '@src/lib/shared/response'

import { authService } from './auth.service'

const setCookie = (context: Context, token: string) => {
  context.header(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; SameSite=Strict`
  )
}

export const authController = {
  async login(context: Context): Promise<Response> {
    const body = await context.req.json()
    logger.debug('Login attempt', { email: body.email })

    try {
      const result = await authService.login(body)

      setCookie(context, result.token)
      logger.info('Login successful', {
        userId: result.id,
        email: result.email
      })

      return context.json(success(result, 200))
    } catch (error) {
      logger.error('Login failed', { email: body.email, error })
      throw error
    }
  },

  async signUp(context: Context): Promise<Response> {
    const body = await context.req.json()
    logger.debug('Sign-up attempt', { email: body.email })

    try {
      const result = await authService.signUp(body)

      setCookie(context, result.token)
      logger.info('Sign-up successful', {
        userId: result.id,
        email: result.email
      })

      return context.json(success(result, 201))
    } catch (error) {
      logger.error('Sign-up failed', { email: body.email, error })
      throw error
    }
  },

  async logout(context: Context): Promise<Response> {
    logger.info('Logout attempt')
    context.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    logger.info('Logout successful')
    return context.json(success({ message: 'Logged out' }, 200))
  }
}
