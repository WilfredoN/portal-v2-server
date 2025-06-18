import type { Context } from 'hono'

import { logger } from '@src/lib/logger'

import { getUsers } from './user.service'

export const usersController = {
  async getAll(context: Context): Promise<Response> {
    try {
      const users = await getUsers()

      return context.json(users)
    } catch (error) {
      logger.error('Error fetching users:', error)
      throw error
    }
  },
}
