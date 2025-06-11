import { Hono } from 'hono'

import { db } from '@src/db'
import { users } from '@src/db/schema'
import { requirePermission } from '@src/middleware'
import { PERMISSION, RESOURCES } from '@src/types/permissions'

export const usersRoute = new Hono()

// TODO: move to service
usersRoute.get(
  '/users',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  async response => {
    try {
      const request = await db.select().from(users)

      if (request.length === 0) {
        return response.json({ message: 'No users found' }, 404)
      }

      return response.json(request)
    } catch (error) {
      console.error('Error fetching users:', error)
      return response.json({ message: 'Internal Server Error' }, 500)
    }
  }
)
