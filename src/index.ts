import 'dotenv/config'
import { Hono } from 'hono'
import { db } from './db'
import { users } from './db/schema'
import { requirePermission } from './middleware'
import { PERMISSION, RESOURCES } from './types/permissions'

const app = new Hono()
// TODO: Make routes as Map

app.all('/', response => response.text('Hello, 42'))

app.get(
  '/users',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  async response => {
    try {
      const request = await db.select().from(users)

      if (request.length === 0) {
        return response.json({ message: 'No users found' }, 404)
      }

      return response.json(request)
    } catch (error) {
      console.error('Error fetching users:', error)
      return response.json({ message: 'Internal Server Error' }, 500)
    }
  }
)

const port = parseInt(process.env.PORT!) || 3000

const Massive = `\x1b[38;5;208mMassive\x1b[0m`

console.log(`${Massive} Bun + Hono server running...`)

export default {
  port: port,
  fetch: app.fetch
}
