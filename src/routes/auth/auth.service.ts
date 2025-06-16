import type { LoginDTO, SignUpDTO } from '@src/types/user'
import { authenticate, create, isExist, validate } from './auth.utils'
import { appError } from '@src/lib/errors/app-error'

export const authService = {
  async signUp(user: SignUpDTO) {
    const validation = validate(user)

    if (validation) {
      throw appError('validation/failed', validation.error, 400)
    }

    if (await isExist(user.email)) {
      throw appError('auth/user-exists', 'User already exists', 409)
    }

    return await create(user)
  },

  async login(user: LoginDTO) {
    return await authenticate(user)
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
