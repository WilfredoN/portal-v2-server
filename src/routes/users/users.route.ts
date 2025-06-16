import { Hono } from 'hono'

import { requirePermission } from '@src/middleware'
import { PERMISSION, RESOURCES } from '@src/types/permissions'
import { usersController } from './users.controller'

export const usersRoute = new Hono()

usersRoute.get(
  '/',
  requirePermission(RESOURCES.USERS, PERMISSION.VIEW),
  usersController.getAll
)
