import type { Context } from 'hono'

import { logger } from '@src/lib/logger'
import { success } from '@src/lib/shared/response'
import { StatusCodes } from 'http-status-codes'

import { getUsers } from './user.service'

export const usersController = {
  async getAll(context: Context): Promise<Response> {
    logger.info('API: GET /users called')
    try {
      const users = await getUsers()
      logger.info('API: GET /users success', { count: users.length })

      return context.json(success(users, StatusCodes.OK))
    } catch (error) {
      logger.error('Error fetching users:', error)
      throw error
    }
  }
}
