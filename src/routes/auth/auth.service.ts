import type { LoginDTO, SignUpDTO } from '@src/types/user'
import { create, isExist, validate } from './auth.utils'

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
    console.log('Login user:', user)
  },

  async logout() {},

  async forgotPassword(email: string) {},

  async resetPassword(token: string, newPassword: string) {}
}
