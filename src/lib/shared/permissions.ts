import type {
  Permissions,
  Resource,
  Role,
} from '@src/types/permissions'

import { getUserPermissions } from '@src/db/permissions'
import { ROLE_PERMISSIONS } from '@src/types/role-permissions'

export const hasRolePermission = (
  role: Role,
  resource: Resource,
  permission: Permissions,
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role]

  return !!rolePermissions?.can[permission]?.includes(resource)
}

export const hasUserPermissionOverride = (
  userPermissions: Array<{ resource: Resource, permission: Permissions }>,
  resource: Resource,
  permission: Permissions,
): boolean => {
  return userPermissions.some(
    perm => perm.resource === resource && perm.permission === permission,
  )
}

export const hasPermission = async (
  userId: string,
  userRole: Role,
  resource: Resource,
  permission: Permissions,
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
