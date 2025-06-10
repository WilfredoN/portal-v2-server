import 'dotenv/config'
import { Hono } from 'hono'
import { db } from './db'
import { users } from './db/schema'
import { requirePermission } from './middleware'
import { PERMISSION, RESOURCES } from './types/permissions'
import { usersRoute } from './routes/users/users'

const app = new Hono()
// TODO: Make routes as Map

app.all('/', response => response.text('Hello, 42'))

// app.route('/auth', authRoute)

app.route('/users', usersRoute)

const port = parseInt(process.env.PORT!) || 3000

const Massive = `\x1b[38;5;208mMassive\x1b[0m`

console.log(`${Massive} Bun + Hono server running...`)

export default {
  port: port,
  fetch: app.fetch
}
