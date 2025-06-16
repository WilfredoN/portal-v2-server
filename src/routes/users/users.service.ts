import { getAllUsers } from '@src/db/users'
import { users } from '@src/db/schema'

export const getUsers = async (): Promise<Array<typeof users.$inferSelect>> => {
  const request = await getAllUsers()

  if (request.length === 0) {
    throw new Error('No users found')
  }

  return request
}
