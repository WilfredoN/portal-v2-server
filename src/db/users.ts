import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { eq } from 'drizzle-orm'
import type { SignUpDTO } from '@src/routes/auth/auth.types'
import type { UserStatusDTO } from '@src/routes/user/user.types'

export const insertUser = async (user: SignUpDTO) => {
  return await db
    .insert(users)
    .values({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    .returning()
}

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

export const getAllUsers = async () => {
  return await db.select().from(users)
}

export const deleteAllUsers = async () => {
  return await db.transaction(async (trx) => {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await trx.delete(auth)
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    return await trx.delete(users).returning()
  })
}
