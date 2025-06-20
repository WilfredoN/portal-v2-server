import {
  deleteAllUsers,
  updateUserRoleByEmail,
  updateUserStatusByEmail
} from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'
import { logger } from '@src/lib/logger'
import { StatusCodes } from 'http-status-codes'

import {
  type UserRoleDTO,
  userRoleSchema,
  userStatusSchema
} from '../user/user.schema'

export const testService = {
  async changeUserStatus(email: string, status: string) {
    logger.debug('Service: changeUserStatus', { email, status })

    if (!userStatusSchema.safeParse(status).success) {
      logger.warn('Change status failed: invalid status', { email, status })
      throw appError('validation/invalid-status', StatusCodes.BAD_REQUEST, {
        status
      })
    }
    const response = await updateUserStatusByEmail(email, status as any)
    if (response.length === 0) {
      logger.warn('Change status failed: user not found', { email })
      throw appError('db/not-found', StatusCodes.NOT_FOUND)
    }
    return response[0]
  },

  async changeUserRole(email: string, role: UserRoleDTO) {
    logger.debug('Service: changeUserRole', { email, role })

    if (!userRoleSchema.safeParse(role).success) {
      logger.warn('Change role failed: invalid role', { email, role })
      throw appError('validation/invalid-role', StatusCodes.BAD_REQUEST, {
        role
      })
    }
    const response = await updateUserRoleByEmail(email, role)
    if (response.length === 0) {
      logger.warn('Change role failed: user not found', { email })
      throw appError('db/not-found', StatusCodes.NOT_FOUND)
    }
    return response[0]
  },

  async clearUsers() {
    logger.debug('Service: clearUsers')
    return await deleteAllUsers()
  }
}
