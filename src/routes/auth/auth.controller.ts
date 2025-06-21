import type { Context } from 'hono'

import { logger } from '@src/lib/logger'
import { error, success } from '@src/lib/shared/response'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'

import { authService } from './auth.service'

export const authController = {
  async login(context: Context): Promise<Response> {
    const body = await context.req.json()
    logger.debug('Login attempt', { email: body.email })

    try {
      const result = await authService.login(body)

      logger.info('Login successful', {
        userId: result.id,
        email: result.email
      })

      return context.json(success(result, StatusCodes.CREATED))
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

      logger.info('Sign-up successful', {
        userId: result.id,
        email: result.email
      })

      return context.json(success(result, StatusCodes.CREATED))
    } catch (error) {
      logger.error('Sign-up failed', { email: body.email, error })
      throw error
    }
  },

  async verifyEmail(context: Context): Promise<Response> {
    const { email, token } = await context.req.json()

    if (!email || !token) {
      logger.fatal('Email verification failed: missing email or token')

      return context.json(
        error(StatusCodes.BAD_REQUEST, 'Email and token are required')
      )
    }

    logger.debug('Email verification attempt', { email, token })

    try {
      await authService.verifyEmail(email, token)

      return context.json(
        success({ message: 'Email verified successfully' }, StatusCodes.OK)
      )
    } catch (error) {
      logger.error('Email verification failed', { email, token, error })
      throw error
    }
  },

  async logout(context: Context): Promise<Response> {
    logger.info('Logout attempt')
    context.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    logger.info('Logout successful')

    return context.json(success({ message: 'Logged out' }, StatusCodes.OK))
  }
}
