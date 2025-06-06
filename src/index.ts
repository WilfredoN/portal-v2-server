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

export default app
