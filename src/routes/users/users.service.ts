import { db } from '@src/db'
import { users } from '@src/db/schema'

export const getUsers = async (): Promise<Array<typeof users.$inferSelect>> => {
  const request = await db.select().from(users)

  if (request.length === 0) {
    throw new Error('No users found')
  }

  return request
}
