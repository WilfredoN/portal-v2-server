import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { errorHandler } from './lib/errors/error-handler'
import { logger } from './lib/logger'
import { authRoute } from './routes/auth/auth.route'
import { testRoute } from './routes/test/test.route'
import { usersRoute } from './routes/user/user.route'

const app = new Hono({ strict: false })

app.use('*', errorHandler())

// TODO: Make routes as Map
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.all('/', response => response.text('Hello, 42'))

app.route('/auth', authRoute)
app.route('/users', usersRoute)
app.route('/test', testRoute)

const port = Number.parseInt(process.env.PORT!) || 3000

const Massive = `\x1B[38;5;208mMassive\x1B[0m`

logger.info(`${Massive} Bun + Hono server running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
