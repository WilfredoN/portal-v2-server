import type { LoginDTO, SignUpDTO } from '@src/types/user'
import { authenticate, create, isExist, validate } from './auth.utils'

export const authService = {
  async signUp(user: SignUpDTO) {
    const validation = validate(user)

    if (validation) {
      throw new Error(validation.error)
    }

    if (await isExist(user.email)) {
      throw new Error('User already exists')
    }

    return await create(user)
  },

  async login(user: LoginDTO) {
    return await authenticate(user)
  },

  async logout() {
    throw new Error('Logout not implemented')
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async forgotPassword(email: string) {
    throw new Error('Forgot password not implemented')
  },

  // eslint-disable-next-line unused-imports/no-unused-vars
  async resetPassword(token: string, newPassword: string) {
    throw new Error('Reset password not implemented')
  }
}
