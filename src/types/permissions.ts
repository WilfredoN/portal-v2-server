import type { Role } from '@src/lib/shared/roles'

export const RESOURCES = {
  USERS: 'users',
  RESIDENTIAL_PLANS: 'residential_plans',
  ISP_PLANS: 'isp_plans',
  SERP_PLANS: 'serp_plans'
} as const

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES]

export const PERMISSION = {
  CREATE: 'create',
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete'
} as const

export type Permissions = (typeof PERMISSION)[keyof typeof PERMISSION]

export type RolePermissions = {
  [role in Role]: {
    can: {
      [permission in Permissions]?: Resource[]
    }
  }
}
