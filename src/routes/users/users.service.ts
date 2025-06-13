import { db } from '@src/db'
import {
  permissions,
  RolePermissions,
  roles,
  userPermissions,
  users
} from '@src/db/schema'
import type { UserPermissionsResponse } from '@src/types/permissions'
import { eq } from 'drizzle-orm'

export const getUsers = async (): Promise<Array<typeof users.$inferSelect>> => {
  const request = await db.select().from(users)

  if (request.length === 0) {
    throw new Error('No users found')
  }

  return request
}

export const getUserPermissions = async (
  userId: string
): Promise<UserPermissionsResponse> => {
  const [user] = await db.select().from(users).where(eq(users.id, userId))

  if (!user) {
    throw new Error(`User with ID ${userId} not found`)
  }

  if (user.role == null) {
    throw new Error(`User with ID ${userId} does not have a role assigned`)
  }

  const core = await db
    .select({
      resource: permissions.resource,
      permission: permissions.permission
    })
    .from(RolePermissions)
    .innerJoin(roles, eq(RolePermissions.roleId, roles.id))
    .innerJoin(permissions, eq(RolePermissions.permissionId, permissions.id))
    .where(eq(roles.name, user.role))

  const override = await db
    .select({
      resource: permissions.resource,
      permission: permissions.permission
    })
    .from(userPermissions)
    .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
    .where(eq(userPermissions.userId, userId))

  return {
    core,
    override
  }
}
