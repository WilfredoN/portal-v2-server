import type { Permissions, Resource } from '@src/types/permissions'
import type { Context, Next } from 'hono'

import { appError } from '@src/lib/errors/app-error'
import { logger } from '@src/lib/logger'
import { hasPermission } from '@src/lib/shared/permissions'
import { StatusCodes } from 'http-status-codes'

export const requirePermission = (
  resource: Resource,
  permission: Permissions
) => {
  return async (context: Context, next: Next) => {
    const payload = context.get('jwtPayload')

    const user = {
      id: payload?.sub,
      role: payload?.role
    }

    if (!user?.id || !user?.role) {
      throw appError('auth/unauthorized', StatusCodes.UNAUTHORIZED)
    }

    try {
      const hasAccess = await hasPermission(
        user.id,
        user.role,
        resource,
        permission
      )

      if (!hasAccess) {
        throw appError('auth/forbidden', StatusCodes.FORBIDDEN, {
          resource,
          permission
        })
      }

      await next()
    } catch (error) {
      logger.error('Permission check failed:', error)
      throw error
    }
  }
}
