import type { LoginDTO, SignUpDTO } from '../../types/user'

export const authService = {
  async signUp(user: SignUpDTO) {},

  async login(user: LoginDTO) {},

  async logout() {},

  async forgotPassword(email: string) {},

  async resetPassword(token: string, newPassword: string) {}
}
