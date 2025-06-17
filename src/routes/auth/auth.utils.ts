import { db } from '@src/db'
import { auth } from '@src/db/schema'
import { encode } from '@src/lib/hash'
import type { LoginDTO, SignUpDTO } from '../auth/auth.types'
import { eq } from 'drizzle-orm'
import { insertUser, selectUserByEmail } from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// TODO: extract (env - ?)
const EMAIL_PROVIDER = 'local'

export const create = async (user: SignUpDTO) => {
  return await db.transaction(async transaction => {
    const hashedPassword = await encode.hash(user.password)

    const [response] = await insertUser(user)

    if (!response) {
      console.error(
        '[createUser] Failed to create user in users table:',
        user.email
      )
      throw appError('db/not-found', 'Failed to create user', 500)
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
  const [dbResponse] = await selectUserByEmail(user.email)

  console.log('[authenticate] User found:', dbResponse)

  if (!dbResponse) {
    throw appError('auth/user-not-found', 'User not found', 404)
  }

  const [authResponse] = await db
    .select()
    .from(auth)
    .where(eq(auth.identifier, user.email))

  console.log('[authenticate] Auth record found:', authResponse)

  if (!authResponse || !authResponse.password) {
    throw appError('auth/invalid-credentials', 'Invalid email', 401)
  }

  const verified = await encode.verify(user.password, authResponse.password)

  console.log('[authenticate] Password verification result:', verified)

  if (!verified) {
    throw appError('auth/invalid-credentials', 'Invalid password', 401)
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
  const response = await selectUserByEmail(email)
  return response.length > 0
}
