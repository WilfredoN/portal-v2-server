import { Hono } from 'hono'
import { requirePermission } from '../../middleware'
import { PERMISSION, RESOURCES } from '../../types/permissions'
import { db } from '../../db'
import { users } from '../../db/schema'

export const usersRoute = new Hono().basePath('/users')

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
