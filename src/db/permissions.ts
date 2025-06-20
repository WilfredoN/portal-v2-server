import type { Permissions, Resource } from '@src/types/permissions'

import { db } from '@src/db'
import {
  permissions as permissionsTable,
  userPermissions,
} from '@src/db/schema'
import { eq } from 'drizzle-orm'

export const getUserPermissions = async (userId: string) => {
  const rows = await db
    .select({
      resource: permissionsTable.resource,
      permission: permissionsTable.permission,
    })
    .from(userPermissions)
    .leftJoin(
      permissionsTable,
      eq(userPermissions.permissionId, permissionsTable.id),
    )
    .where(eq(userPermissions.userId, userId))

  return rows.filter(row => row.resource && row.permission) as Array<{
    resource: Resource
    permission: Permissions
  }>
}
