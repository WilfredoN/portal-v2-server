import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { encode } from '@src/lib/hash'
import type { SignUpDTO } from '@src/types/user'
import { eq } from 'drizzle-orm'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// TODO: extract (env - ?)
const EMAIL_PROVIDER = 'local'

export const create = async (user: SignUpDTO) => {
  return await db.transaction(async transaction => {
    const hashedPassword = await encode.hash(user.password)

    const [response] = await transaction
      .insert(users)
      .values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
      .returning()

    if (!response) {
      console.error(
        '[createUser] Failed to create user in users table:',
        user.email
      )
      throw new Error('Failed to create user')
    }

    console.log('[createUser] Inserting user into auth table:', user.email)
    await transaction.insert(auth).values({
      userId: response.id,
      identifier: user.email,
      provider: EMAIL_PROVIDER,
      createdAt: new Date(),
      password: hashedPassword
    })
    console.log('[createUser] User created successfully:', response)

    return response
  })
}

export const validate = (user: SignUpDTO) => {
  if (!user.email || !user.password || !user.firstName || !user.lastName) {
    return { error: 'Missing required fields' }
  }

  if (user.password.length < 8) {
    return { error: 'Password must be at least 8 characters long' }
  }

  if (!emailRegex.test(user.email)) {
    return { error: 'Invalid email format' }
  }

  return null
}

export const isExist = async (email: string) => {
  const response = await db.select().from(users).where(eq(users.email, email))
  return response.length > 0
}
