import type { Context } from 'hono'
import { authService } from './auth.service'
import { sign } from 'hono/jwt'

export const authController = {
  async login(content: Context) {
    try {
      const body = await content.req.json()

      const result = await authService.login(body)

      const token = await sign(
        {
          sub: result.id,
          email: result.email,
          role: result.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60
        },
        process.env.JWT_SECRET!
      )

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

  async signUp(content: Context) {
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
