import { validateSchema } from '@src/lib/errors/withZodValidation'
import type { LoginDTO, SignUpDTO } from '../auth/auth.types'
import { loginSchema, signUpSchema } from './auth.schema'
import { authenticate, create, isExist } from './auth.utils'
import { appError } from '@src/lib/errors/app-error'

export const authService = {
  async signUp(user: SignUpDTO) {
    const body = validateSchema(signUpSchema, user)

    if (await isExist(body.email)) {
      throw appError('auth/user-exists', 'User already exists', 409)
    }

    return await create(body)
  },

  async login(user: LoginDTO) {
    const body = validateSchema(loginSchema, user)
    return await authenticate(body)
  },

  async logout() {
    throw appError('internal/server-error', 'Logout not implemented', 501)
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async forgotPassword(email: string) {
    throw appError(
      'internal/server-error',
      'Forgot password not implemented',
      501
    )
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async resetPassword(token: string, newPassword: string) {
    throw appError(
      'internal/server-error',
      'Reset password not implemented',
      501
    )
  }
}
