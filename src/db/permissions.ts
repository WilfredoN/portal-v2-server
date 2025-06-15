import { db } from '@src/db'
import {
  userPermissions,
  permissions as permissionsTable
} from '@src/db/schema'
import { eq } from 'drizzle-orm'
import type { Resource, Permissions } from '@src/types/permissions'

export async function getUserPermissions(userId: string) {
  const rows = await db
    .select({
      resource: permissionsTable.resource,
      permission: permissionsTable.permission
    })
    .from(userPermissions)
    .leftJoin(
      permissionsTable,
      eq(userPermissions.permissionId, permissionsTable.id)
    )
    .where(eq(userPermissions.userId, userId))

  return rows.filter(row => row.resource && row.permission) as Array<{
    resource: Resource
    permission: Permissions
  }>
}
