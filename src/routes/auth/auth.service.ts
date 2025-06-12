import { db } from '@src/db'
import { auth, users } from '@src/db/schema'
import { encode } from '@src/lib/hash'
import type { LoginDTO, SignUpDTO } from '@src/types/user'
import { eq } from 'drizzle-orm'

// TODO: extract

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_PROVIDER = 'local'

const validate = (user: SignUpDTO) => {
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

// TODO: extract
const isExist = async (email: string) => {
  const response = await db.select().from(users).where(eq(users.email, email))
  return response.length > 0
}

// TODO: extract
const createUser = async (user: SignUpDTO) => {
  console.log('[createUser] Hashing password for:', user.email)
  const hashedPassword = await encode.hash(user.password)

  console.log('[createUser] Password hash:', hashedPassword)

  // TODO: use transactions (all or nothing)
  console.log('[createUser] Inserting user into users table:', user.email)
  const [response] = await db
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
  await db.insert(auth).values({
    userId: response.id,
    identifier: user.email,
    provider: EMAIL_PROVIDER,
    createdAt: new Date(),
    password: hashedPassword
  })

  console.log('[createUser] User created successfully:', response)
  return {
    id: response.id,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName
  }
}

export const authService = {
  async signUp(user: SignUpDTO) {
    console.log('[signUp] Received sign up request:', user)

    const validationResponse = validate(user)
    if (validationResponse) {
      console.warn('[signUp] Validation failed:', validationResponse.error)
      throw new Error(validationResponse.error)
    }

    if (await isExist(user.email)) {
      console.warn('[signUp] User already exists:', user.email)
      throw new Error('User already exists')
    }

    console.log('[signUp] Creating user:', user.email)
    return await createUser(user)
  },

  async login(user: LoginDTO) {
    console.log('Login user:', user)
  },

  async logout() {},

  async forgotPassword(email: string) {},

  async resetPassword(token: string, newPassword: string) {}
}
