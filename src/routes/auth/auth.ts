import { Hono } from 'hono'
import { authController } from './auth.controller'
const auth = new Hono().basePath('/auth')

auth.get('/', c => {
  return c.json({ message: 'Auth endpoint test' })
})

auth.post('/login', authController.login)

auth.post('/sign-up', authController.signUp)

auth.post('/logout', c => {
  return c.json({ message: 'Logout endpoint' })
})
auth.post('/forgot-password', c => {
  return c.json({ message: 'Forgot password endpoint' })
})

auth.post('/reset-password', c => {
  return c.json({ message: 'Reset password endpoint' })
})
