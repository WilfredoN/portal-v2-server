import { db } from '@src/db'
import { users } from '@src/db/schema'
import { eq } from 'drizzle-orm'
import type { SignUpDTO } from '@src/routes/auth/auth.types'
import type { UserStatus } from '@src/routes/user/user.types'

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
  status: UserStatus
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
