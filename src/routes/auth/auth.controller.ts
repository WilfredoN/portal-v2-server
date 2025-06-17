import type { Context } from 'hono'
import { authService } from './auth.service'
import { generateToken } from '@src/lib/jwt'

export const authController = {
  async login(content: Context): Promise<Response> {
    try {
      const body = await content.req.json()

      const result = await authService.login(body)

      const token = await generateToken({
        id: result.id,
        email: result.email,
        role: result.role
      })

      content.header(
        'Set-Cookie',
        `token=${token}; HttpOnly; Path=/; SameSite=Strict`
      )
      return content.json({ ...result, token })
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async signUp(content: Context): Promise<Response> {
    try {
      const body = await content.req.json()

      const result = await authService.signUp(body)

      if (result === undefined || result === null) {
        throw new Error('Sign up failed')
      }

      return content.json(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async logout(content: Context) {
    content.header('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    return content.json({ message: 'Logged out' })
  }
}
