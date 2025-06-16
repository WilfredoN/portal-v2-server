import type { Context } from 'hono'
import { authService } from './auth.service'
import { sign } from 'hono/jwt'

export const authController = {
  async login(content: Context) {
    try {
      const body = await content.req.json()

      const result = await authService.login(body)

      if (result === undefined || result === null) {
        return content.json({ message: 'Login failed' }, 500)
      }

      const token = await sign(
        {
          sub: result.id,
          email: result.email,
          role: result.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60
        },
        process.env.JWT_SECRET!
      )

      return content.json({ ...result, token })
    } catch (error) {
      console.error(error)

      return content.json({ message: 'Login failed' }, 500)
    }
  },

  async signUp(content: Context) {
    try {
      const body = await content.req.json()

      const result = await authService.signUp(body)

      if (result === undefined || result === null) {
        return content.json({ message: 'Sign up failed' }, 500)
      }

      return content.json(result)
    } catch (error) {
      console.error(error)

      return content.json({ message: 'Sign up failed' }, 500)
    }
  }
}
