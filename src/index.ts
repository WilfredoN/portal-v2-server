import 'dotenv/config'
import { Hono } from 'hono'
import { authRoute } from './routes/auth/auth.route'
import { usersRoute } from './routes/users/users.route'
import { testRoute } from './routes/test/test.route'

const app = new Hono()
// TODO: Make routes as Map

app.all('/', response => response.text('Hello, 42'))

app.route('/auth', authRoute)
app.route('/users', usersRoute)
app.route('/test', testRoute)

const port = parseInt(process.env.PORT!) || 3000

const Massive = `\x1b[38;5;208mMassive\x1b[0m`

console.log(`${Massive} Bun + Hono server running...`)

export default {
  port: port,
  fetch: app.fetch
}
