import type { LoginDTO, SignUpDTO } from '@src/routes/auth/auth.schema'
import type { UserDTO, UserRoleDTO } from '@src/routes/user/user.schema'

import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { appError } from '@src/lib/errors/app-error'
import { UserStatus } from '@src/types/user-status'
import { eq } from 'drizzle-orm'
import { StatusCodes } from 'http-status-codes'

const EMAIL_PROVIDER = 'local'

export const selectUserByEmail = async (
  email: string
): Promise<UserDTO | null> => {
  const [user] = await db.select().from(users).where(eq(users.email, email))

  return user ?? null
}

export const selectUserById = async (id: string): Promise<UserDTO | null> => {
  const [user] = await db.select().from(users).where(eq(users.id, id))

  return user ?? null
}

export const isUserExist = async (email: string): Promise<boolean> => {
  const user = await selectUserByEmail(email)

  return !!user
}

export const isUserVerified = async (email: string) => {
  const user = await selectUserByEmail(email)

  if (!user) {
    throw appError('auth/user-not-found', StatusCodes.NOT_FOUND)
  }

  return user.status === UserStatus.VERIFIED
}

export const updateUserStatusByEmail = async (
  email: string,
  status: UserStatus
) => {
  const user = await isUserExist(email)

  if (!user) {
    throw appError('auth/user-not-found', StatusCodes.NOT_FOUND)
  }

  if (!Object.values(UserStatus).includes(status)) {
    throw appError('user/invalid-status', StatusCodes.BAD_REQUEST)
  }

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
  const response = await db
    .select()
    .from(auth)
    .where(eq(auth.identifier, email))

  return response[0] ?? null
}

export const authenticateUser = async (user: LoginDTO) => {
  const dbResponse = await selectUserByEmail(user.email)
  const authResponse = await getAuthByEmail(user.email)

  return { dbResponse, authResponse }
}
