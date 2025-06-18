import { Hono } from 'hono'

import { authController } from './auth.controller'

export const authRoute = new Hono()

authRoute.get('/', (content) => {
  return content.json({ message: 'Auth endpoint test' })
})

authRoute.post('/login', authController.login)

authRoute.post('/sign-up', authController.signUp)

authRoute.post('/logout', authController.logout)

authRoute.post('/forgot-password', (content) => {
  return content.json({ message: 'Forgot password endpoint' })
})

authRoute.post('/reset-password', (content) => {
  return content.json({ message: 'Reset password endpoint' })
})
