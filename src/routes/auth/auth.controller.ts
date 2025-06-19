import type { Context } from 'hono'
import type { z } from 'zod'

import { logger } from '@src/lib/logger'
import { success } from '@src/lib/shared/response'

import type { loginSchema, signUpSchema } from './auth.schema'

import { authService } from './auth.service'

export const authController = {
  async login(content: Context): Promise<Response> {
    const body = await content.req.json<z.infer<typeof loginSchema>>()

    logger.debug('Login: ', { email: body.email })
    try {
      const result = await authService.login(body)
      logger.info('Login successful', {
        userId: result.id,
        email: result.email
      })

      content.header(
        'Set-Cookie',
        `token=${result.token}; HttpOnly; Path=/; SameSite=Strict`
      )

      return content.json(success(result, 200))
    } catch (error) {
      logger.error('Login failed', { email: body.email, error })

      throw error
    }
  },

  async signUp(content: Context): Promise<Response> {
    const body = await content.req.json<z.infer<typeof signUpSchema>>()
    logger.debug('Sign up: ', {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName
    })

    try {
      const result = await authService.signUp(body)

      logger.info('Sign up successful', {
        userId: result.id,
        email: result.email
      })

      content.header(
        'Set-Cookie',
        `token=${result.token}; HttpOnly; Path=/; SameSite=Strict`
      )

      return content.json(success(result, 201))
    } catch (error) {
      logger.error('Sign up failed', { email: body.email, error })

      throw error
    }
  },

  async logout(content: Context): Promise<Response> {
    logger.info('Logout attempt')
    content.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    logger.info('Logout successful')
    return content.json(success({ message: 'Logged out' }, 200))
  }
}
