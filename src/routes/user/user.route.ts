import { requirePermission } from '@src/middlewares/role'
import { PERMISSION, RESOURCES } from '@src/types/permissions'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

import { usersController } from './user.controller'

export const usersRoute = new Hono()

usersRoute.use('*', jwt({ secret: process.env.JWT_SECRET! }))

usersRoute.get(
  '/',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  usersController.getAll
)
