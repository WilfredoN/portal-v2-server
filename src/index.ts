import { Hono } from 'hono'
import { db } from './db'
import { users } from './db/schema'

const app = new Hono()

app.get('/', response => response.text('Hello, 42'))

app.get('/users', async response => {
  const request = await db.select().from(users)

  if (request.length === 0) {
    return response.json({ message: 'No users found' }, 404)
  }

  return response.json(request)
})

const port = parseInt(process.env.PORT!) || 3000

const Massive = `\x1b[38;5;208mMassive\x1b[0m`

console.log(`${Massive} Bun + Hono server running...`)

export default {
  port: port,
  fetch: app.fetch
}
