import { getUsers } from './users.service'
import type { Context } from 'hono'

export const usersController = {
  async getAll(context: Context) {
    try {
      const users = await getUsers()
      return context.json(users)
    } catch (error) {
      if (error instanceof Error && error.message === 'No users found') {
        return context.json({ message: error.message }, 404)
      }
      console.error('Error fetching users:', error)
      return context.json({ message: 'Internal Server Error' }, 500)
    }
  }
}
