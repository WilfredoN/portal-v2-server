import { db } from '@src/db'
import { users } from '@src/db/schema'
import { eq } from 'drizzle-orm'
import type { SignUpDTO } from '@src/types/user'
import { userStatusEnum } from '@src/db/schema'

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
  status: (typeof userStatusEnum.enumValues)[number]
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
