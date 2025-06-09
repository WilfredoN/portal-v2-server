import {
  ROLE_PERMISSIONS,
  type Action,
  type Resource
} from './types/permissions'

export const hasPermission = (
  user: { role: string },
  resource: Resource,
  action: Action
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[user.role]

  if (!rolePermissions) {
    return false
  }

  const allowedResources = rolePermissions.can[action]

  return allowedResources?.includes(resource) || false
}
