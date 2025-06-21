import type { Context } from 'hono'

import { logger } from '@src/lib/logger'
import { matchedRoutes } from 'hono/route'
import { StatusCodes } from 'http-status-codes'

import { testService } from './test.service'

export const testController = {
  async getTest(context: Context): Promise<Response> {
    logger.debug('API: GET /test called')
    const routes = matchedRoutes(context).map(route => ({
      method: route.method,
      path: route.path
    }))
    const response = {
      message: 'Test route is working!',
      routes
    }

    return context.json(response)
  },

  async changeStatus(context: Context): Promise<Response> {
    const { email, status } = await context.req.json()
    logger.debug('API: POST /test/change-status', { email, status })

    const user = await testService.changeUserStatus(email, status)
    logger.info('User status updated', { email, status })

    return context.json(
      { message: 'User verified successfully', user },
      StatusCodes.OK
    )
  },

  async changeRole(context: Context): Promise<Response> {
    const { email, role } = await context.req.json()
    logger.debug('API: POST /test/change-role', { email, role })
    const user = await testService.changeUserRole(email, role)
    logger.info('User role updated', { email, role })

    return context.json(
      { message: 'User role updated successfully', user },
      StatusCodes.OK
    )
  },

  async clearUsers(context: Context): Promise<Response> {
    logger.debug('API: POST /test/clear-users called')
    const deletedUsers = await testService.clearUsers()
    logger.info('Users deleted', { count: deletedUsers.length })

    return context.json(
      { message: `${deletedUsers.length} users deleted successfully` },
      StatusCodes.OK
    )
  }
}
