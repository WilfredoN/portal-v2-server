import { Hono } from 'hono'

const auth = new Hono().basePath('/auth')

auth.get('/', c => {
  return c.json({ message: 'Auth endpoint test' })
})

auth.post('/login', c => {
  return c.json({ message: 'Login endpoint' })
})

auth.post('/sign-up', c => {
  return c.json({ message: 'Register endpoint' })
})

auth.post('/logout', c => {
  return c.json({ message: 'Logout endpoint' })
})
auth.post('/forgot-password', c => {
  return c.json({ message: 'Forgot password endpoint' })
})

auth.post('/reset-password', c => {
  return c.json({ message: 'Reset password endpoint' })
})
