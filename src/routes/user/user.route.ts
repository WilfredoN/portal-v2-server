import { Hono } from 'hono'
import { usersController } from './user.controller'
// import { authMiddleware } from '@src/middlewares/auth'

export const usersRoute = new Hono()

// usersRoute.use('*', authMiddleware())

usersRoute.get(
  '/',
  // requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  usersController.getAll
)
