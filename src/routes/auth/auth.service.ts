import {
  authenticateUser,
  createUserWithAuth,
  isUserExist,
} from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'
import { validateSchema } from '@src/lib/errors/with-zod-validation'
import { encode } from '@src/lib/hash'
import { StatusCodes } from 'http-status-codes'

import {
  type LoginDTO,
  loginSchema,
  type SignUpDTO,
  type UserResponseDTO,
} from './auth.schema'

export const authService = {
  async signUp(user: SignUpDTO): Promise<UserResponseDTO> {
    if (await isUserExist(user.email)) {
      throw appError('auth/user-exists', 'User already exists', StatusCodes.CONFLICT)
    }

    const password = await encode.hash(user.password)
    const data = { ...user, password }

    const result = await createUserWithAuth(data)
    if (!result) {
      throw appError('db/not-found', 'Failed to create user', 500)
    }

    return result
  },

  async login(user: LoginDTO) {
    const body = validateSchema(loginSchema, user)
    const { dbResponse, authResponse } = await authenticateUser(body)

    if (!dbResponse) {
      throw appError('auth/user-not-found', 'User not found', 404)
    }

    if (!authResponse || !authResponse.password) {
      throw appError('auth/invalid-credentials', 'Invalid credentials', 401)
    }

    const verified = await encode.verify(body.password, authResponse.password)
    if (!verified) {
      throw appError('auth/invalid-credentials', 'Invalid credentials', 401)
    }

    return {
      id: dbResponse.id,
      email: dbResponse.email,
      firstName: dbResponse.firstName,
      lastName: dbResponse.lastName,
      status: dbResponse.status,
      role: dbResponse.role,
    }
  },

  async logout() {
    throw appError('internal/server-error', 'Logout not implemented', 501)
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async forgotPassword(email: string) {
    throw appError(
      'internal/server-error',
      'Forgot password not implemented',
      501,
    )
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async resetPassword(token: string, newPassword: string) {
    throw appError(
      'internal/server-error',
      'Reset password not implemented',
      501,
    )
  },
}
