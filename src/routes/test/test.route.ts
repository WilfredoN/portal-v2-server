import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import { testController } from './test.controller'
import { changeRoleSchema, changeStatusSchema } from './test.schema'

export const testRoute = new Hono()

testRoute.get('/', testController.getTest)
testRoute.post(
  '/change-status',
  zValidator('json', changeStatusSchema),
  testController.changeStatus
)
testRoute.post(
  '/change-role',
  zValidator('json', changeRoleSchema),
  testController.changeRole
)
testRoute.post('/clear-users', testController.clearUsers)
