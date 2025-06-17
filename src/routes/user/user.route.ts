import { Hono } from 'hono'

import { requirePermission } from '@src/middleware'
import { PERMISSION, RESOURCES } from '@src/types/permissions'
import { usersController } from './user.controller'
import { authMiddleware } from '@src/lib/jwt'

export const usersRoute = new Hono()

usersRoute.use('*', authMiddleware())

usersRoute.get(
  '/',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  usersController.getAll
)
