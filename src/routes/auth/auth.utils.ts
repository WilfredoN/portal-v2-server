import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { encode } from '@src/lib/hash'
import type { LoginDTO, SignUpDTO } from '@src/types/user'
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

export const authenticate = async (user: LoginDTO) => {
  const [dbResponse] = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email))

  console.log('[authenticate] User found:', dbResponse)

  if (!dbResponse) {
    throw new Error('User not found')
  }

  const [authResponse] = await db
    .select()
    .from(auth)
    .where(eq(auth.identifier, user.email))

  console.log('[authenticate] Auth record found:', authResponse)

  if (!authResponse || !authResponse.password) {
    throw new Error('Invalid email')
  }

  const verified = await encode.verify(user.password, authResponse.password)

  console.log('[authenticate] Password verification result:', verified)

  if (!verified) {
    throw new Error('Invalid password')
  }

  return {
    id: dbResponse.id,
    email: dbResponse.email,
    firstName: dbResponse.firstName,
    lastName: dbResponse.lastName,
    status: dbResponse.status,
    role: dbResponse.role
  }
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
