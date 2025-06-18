import { type Context, type Next } from 'hono'
import { type Permissions, type Resource } from '@src/types/permissions'
import { appError } from '@src/lib/errors/app-error'
import { hasPermission } from '@src/lib/shared/permissions'
import type { UserDTO } from '@src/routes/user/user.types'

export const requirePermission = (
  resource: Resource,
  permission: Permissions
) => {
  return async (context: Context, next: Next) => {
    const user: UserDTO = context.get('user')

    if (!user?.id) {
      throw appError('auth/unauthorized', 'Unauthorized: User not found', 401)
    }

    if (!user.role) {
      throw appError(
        'auth/unauthorized',
        'Unauthorized: User role not assigned',
        401
      )
    }

    try {
      const hasAccess = await hasPermission(
        user.id,
        user.role,
        resource,
        permission
      )

      if (!hasAccess) {
        throw appError(
          'auth/forbidden',
          'Forbidden: Insufficient permissions',
          403,
          { resource, permission }
        )
      }

      await next()
    } catch (error) {
      console.error('Permission check failed:', error)
      throw error
    }
  }
}
