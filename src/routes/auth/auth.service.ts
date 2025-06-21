import {
  authenticateUser,
  createUserWithAuth,
  isUserExist,
  isUserVerified,
  updateUserStatusByEmail
} from '@src/db/users'
import { getVerificationUrl, sendVerificationEmail } from '@src/lib/email'
import { appError } from '@src/lib/errors/app-error'
import { encode } from '@src/lib/hash'
import { generateToken } from '@src/lib/jwt'
import { verify } from 'hono/jwt'
import { StatusCodes } from 'http-status-codes'

import type { LoginDTO, SignUpDTO, UserResponseDTO } from './auth.schema'

export const authService = {
  async signUp(user: SignUpDTO): Promise<UserResponseDTO> {
    if (await isUserExist(user.email)) {
      throw appError('auth/user-exists', StatusCodes.CONFLICT)
    }

    const password = await encode.hash(user.password)
    const data = { ...user, password }

    const result = await createUserWithAuth(data)

    if (!result) {
      throw appError('db/not-found', StatusCodes.INTERNAL_SERVER_ERROR)
    }

    const token = await generateToken({
      id: result.id,
      email: result.email,
      role: result.role
    })

    const verificationUrl = getVerificationUrl(result.email, token)
    await sendVerificationEmail({
      to: result.email,
      verificationUrl
    })

    return { ...result, token }
  },

  async login(user: LoginDTO): Promise<UserResponseDTO> {
    const { dbResponse, authResponse } = await authenticateUser(user)

    if (!dbResponse || !authResponse) {
      throw appError('auth/user-not-found', StatusCodes.NOT_FOUND)
    }

    const isPasswordValid = await encode.verify(
      user.password,
      authResponse.password!
    )

    if (!isPasswordValid) {
      throw appError('auth/invalid-password', StatusCodes.UNAUTHORIZED)
    }

    const token = await generateToken({
      id: dbResponse.id,
      email: dbResponse.email,
      role: dbResponse.role
    })

    return { ...dbResponse, token }
  },
  // TODO: zod for token & email?
  async verifyEmail(email: string, token: string): Promise<void> {
    const payload = await verify(token, process.env.JWT_SECRET!)

    if (!payload || payload.email !== email) {
      throw appError('auth/invalid-token', StatusCodes.UNAUTHORIZED)
    }
    const user = await isUserExist(email)

    if (!user) {
      throw appError('auth/user-not-found', StatusCodes.NOT_FOUND)
    }
    const verified = await isUserVerified(email)

    if (verified) {
      throw appError('auth/email-already-verified', StatusCodes.BAD_REQUEST)
    }

    await updateUserStatusByEmail(email, 'verified')
  },

  async logout(): Promise<void> {
    throw appError('internal/server-error', StatusCodes.NOT_IMPLEMENTED)
  },

  async forgotPassword(): Promise<void> {
    throw appError('internal/server-error', StatusCodes.NOT_IMPLEMENTED)
  },

  async resetPassword(): Promise<void> {
    throw appError('internal/server-error', StatusCodes.NOT_IMPLEMENTED)
  }
}
