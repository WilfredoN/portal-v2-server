import type { Context, Next } from 'hono'
import { type Permissions, type Resource, type Role } from './types/permissions'
import { ROLE_PERMISSIONS } from './types/role-permissions'
import type { User } from './types/user'
import { getUserPermissions } from './db/permissions'
import { appError } from '@src/lib/errors/app-error'

const hasRolePermission = (
  role: Role,
  resource: Resource,
  permission: Permissions
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role]
  return !!rolePermissions?.can[permission]?.includes(resource)
}

const hasUserPermissionOverride = (
  userPermissions: Array<{ resource: Resource; permission: Permissions }>,
  resource: Resource,
  permission: Permissions
): boolean => {
  return userPermissions.some(
    perm => perm.resource === resource && perm.permission === permission
  )
}

const hasPermission = async (
  userId: string,
  userRole: Role,
  resource: Resource,
  permission: Permissions
): Promise<boolean> => {
  if (hasRolePermission(userRole, resource, permission)) {
    return true
  }

  const userPerms = await getUserPermissions(userId)

  if (hasUserPermissionOverride(userPerms, resource, permission)) {
    return true
  }

  return false
}

export const requirePermission = (
  resource: Resource,
  permission: Permissions
) => {
  return async (context: Context, next: Next) => {
    const user: User = context.get('user')

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
