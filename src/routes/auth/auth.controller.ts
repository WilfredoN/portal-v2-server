import type { Context } from 'hono'
import { authService } from './auth.service'

export const authController = {
  async login(content: Context) {
    try {
      const body = await content.req.json()

      const result = await authService.login(body)

      if (result === undefined || result === null) {
        return content.json({ message: 'Login failed' }, 500)
      }

      return content.json(result)
    } catch (error) {
      console.error('Login error:', error)
      return content.json({ message: 'Login failed' }, 500)
    }
  }
}
