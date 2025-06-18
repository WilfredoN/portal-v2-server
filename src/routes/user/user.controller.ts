import { getUsers } from './user.service'
import type { Context } from 'hono'

export const usersController = {
  async getAll(context: Context): Promise<Response> {
    try {
      const users = await getUsers()

      return context.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }
}
