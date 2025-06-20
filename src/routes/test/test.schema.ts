import { z } from 'zod'

import { userRoleSchema, userStatusSchema } from '../user/user.schema'

export const changeRoleSchema = z.object({
  email: z.string().email(),
  role: userRoleSchema
})

export const changeStatusSchema = z.object({
  email: z.string().email(),
  status: userStatusSchema
})
