import type { LoginDTO, SignUpDTO } from '@src/types/user'

export const authService = {
  async signUp(user: SignUpDTO) {
    console.log('Sign up user:', user)
  },

  async login(user: LoginDTO) {
    console.log('Login user:', user)
  },

  async logout() {},

  async forgotPassword(email: string) {},

  async resetPassword(token: string, newPassword: string) {}
}
