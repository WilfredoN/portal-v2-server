import type { SignUpDTO } from '@src/routes/auth/auth.schema'
import type { LoginDTO } from '@src/routes/auth/auth.schema'
import type { UserRoleDTO, UserStatusDTO } from '@src/routes/user/user.schema'

import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { appError } from '@src/lib/errors/app-error'
import { eq } from 'drizzle-orm'
import { StatusCodes } from 'http-status-codes'

const EMAIL_PROVIDER = 'local'

export const selectUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email))
}

export const selectUserById = async (id: string) => {
  return await db.select().from(users).where(eq(users.id, id))
}

export const updateUserStatusByEmail = async (
  email: string,
  status: UserStatusDTO
) => {
  return await db
    .update(users)
    .set({ status })
    .where(eq(users.email, email))
    .returning()
}

export const updateUserRoleByEmail = async (
  email: string,
  role: UserRoleDTO
) => {
  return await db
    .update(users)
    .set({ role })
    .where(eq(users.email, email))
    .returning()
}

export const getAllUsers = async () => {
  return await db.select().from(users)
}

export const deleteAllUsers = async () => {
  return await db.transaction(async (transaction) => {
    await transaction.delete(auth)
    return await transaction.delete(users).returning()
  })
}

export const createUserWithAuth = async (user: SignUpDTO) => {
  return await db.transaction(async (transaction) => {
    const [response] = await transaction
      .insert(users)
      .values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
      .returning()

    if (!response) {
      throw appError('db/not-found', StatusCodes.INTERNAL_SERVER_ERROR)
    }

    await transaction.insert(auth).values({
      userId: response.id,
      identifier: user.email,
      provider: EMAIL_PROVIDER,
      createdAt: new Date(),
      password: user.password
    })

    return response
  })
}

export const getAuthByEmail = async (email: string) => {
  const [response] = await db
    .select()
    .from(auth)
    .where(eq(auth.identifier, email))

  return response
}

export const authenticateUser = async (user: LoginDTO) => {
  const [dbResponse] = await selectUserByEmail(user.email)
  const authResponse = await getAuthByEmail(user.email)

  return { dbResponse, authResponse }
}

export const isUserExist = async (email: string) => {
  const response = await selectUserByEmail(email)

  return response.length > 0
}
