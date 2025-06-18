import { authMiddleware } from '@src/middlewares/auth'
import { requirePermission } from '@src/middlewares/role'
import { PERMISSION, RESOURCES } from '@src/types/permissions'
import { Hono } from 'hono'

import { usersController } from './user.controller'

export const usersRoute = new Hono()

usersRoute.use('*', authMiddleware())

usersRoute.get(
  '/',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  usersController.getAll,
)
