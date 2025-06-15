import type { Context, Next } from 'hono'
import { type Permissions, type Resource, type Role } from './types/permissions'
import { ROLE_PERMISSIONS } from './types/role-permissions'

const hasPermission = (
  user: { role: Role },
  resource: Resource,
  permission: Permissions
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[user.role]

  if (!rolePermissions) {
    return false
  }

  const allowedResources = rolePermissions.can[permission]

  return allowedResources?.includes(resource) || false
}

export const requirePermission = (
  resource: Resource,
  permission: Permissions
) => {
  return async (context: Context, next: Next) => {
    const user = context.get('user')

    if (!user || !user.role) {
      return context.json({ message: 'Unauthorized' }, 401)
    }

    if (!hasPermission(user, resource, permission)) {
      return context.json({ message: 'Forbidden' }, 403)
    }

    await next()
  }
}
