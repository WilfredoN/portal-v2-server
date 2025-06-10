import { Hono } from 'hono'
import type { User } from '../types/user'

const users = new Hono().basePath('/users')

users.get('/', c => {
  const users: User[] = []

  if (users.length === 0) {
    return c.json({ message: 'No users found' }, 404)
  }

  return c.json(users)
})
