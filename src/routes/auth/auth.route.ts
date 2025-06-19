import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import { authController } from './auth.controller'
import { loginSchema, signUpSchema } from './auth.schema'

export const authRoute = new Hono()

authRoute.get('/', (context) => {
  return context.json({ message: 'Auth endpoint test' })
})

authRoute.post('/login', zValidator('json', loginSchema), authController.login)
authRoute.post('/sign-up', zValidator('json', signUpSchema), authController.signUp)
authRoute.post('/logout', authController.logout)
authRoute.post('/forgot-password', (context) => {
  return context.json({ message: 'Forgot password endpoint' })
})

authRoute.post('/reset-password', (context) => {
  return context.json({ message: 'Reset password endpoint' })
})
