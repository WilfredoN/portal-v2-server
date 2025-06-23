import type { AppContext } from '@src/types/context'
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
  return async (context: Context<AppContext>, next: Next) => {
    const payload = context.get('jwtPayload')

    logger.debug('Checking permissions for user:', { sub: payload.sub })

    if (!payload?.sub || !payload?.role) {
      throw appError('auth/unauthorized', StatusCodes.UNAUTHORIZED)
    }

    try {
      const hasAccess = await hasPermission(
        payload.sub,
        payload.role,
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
