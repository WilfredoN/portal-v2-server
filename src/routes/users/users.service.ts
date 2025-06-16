import { getAllUsers } from '@src/db/users'
import { users } from '@src/db/schema'
import { appError } from '@src/lib/errors/app-error'

export const getUsers = async (): Promise<Array<typeof users.$inferSelect>> => {
  const request = await getAllUsers()

  if (request.length === 0) {
    throw appError('db/not-found', 'No users found', 404)
  }

  return request
}
