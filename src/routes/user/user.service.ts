import { getAllUsers } from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'

import type { UserDTO } from './user.schema'

export const getUsers = async (): Promise<Array<UserDTO>> => {
  const request = await getAllUsers()

  if (request.length === 0) {
    throw appError('db/not-found', 'No users found', 404)
  }

  return request
}
