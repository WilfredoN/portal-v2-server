import { deleteAllUsers, updateUserStatusByEmail } from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'
import { logger } from '@src/lib/logger'
import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'

export const testRoute = new Hono()

testRoute.get('/', async (content) => {
  logger.info('API: GET /test called')
  const response = {
    message: 'Test route is working!',
    routes: [
      { method: 'GET', path: '/test' },
      { method: 'POST', path: '/test/change-status' }
    ]
  }
  return content.json(response)
})

testRoute.post('/change-status', async (content) => {
  const { email, status } = await content.req.json()

  logger.info('API: POST /test/change-status', { email, status })

  if (!email || !status) {
    logger.warn('Change status failed: missing email or status')

    throw appError('validation/failed', StatusCodes.BAD_REQUEST)
  }

  const response = await updateUserStatusByEmail(email, status)
  if (response.length === 0) {
    logger.warn('Change status failed: user not found', { email })

    throw new Error('User not found')
  }

  logger.info('User status updated', { email, status })

  return content.json(
    { message: 'User verified successfully', user: response[0] },
    StatusCodes.OK
  )
})

testRoute.post('/clear-users', async (context) => {
  logger.info('API: POST /test/clear-users called')
  try {
    const deletedUsers = await deleteAllUsers()

    logger.info('Users deleted', { count: deletedUsers.length })

    return context.json(
      { message: `${deletedUsers.length} users deleted successfully` },
      StatusCodes.OK
    )
  } catch (error) {
    logger.error('Error deleting users:', error)

    throw appError('internal/server-error', StatusCodes.INTERNAL_SERVER_ERROR)
  }
})
