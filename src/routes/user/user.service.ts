import { getAllUsers } from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'
import { logger } from '@src/lib/logger'

import type { UserDTO } from './user.schema'

export const getUsers = async (): Promise<Array<UserDTO>> => {
  logger.info('Fetching all users')
  const request = await getAllUsers()

  if (request.length === 0) {
    logger.warn('No users found in database')
    throw appError('db/not-found', 'No users found', 404)
  }

  logger.info('Users fetched successfully', { count: request.length })
  return request
}
