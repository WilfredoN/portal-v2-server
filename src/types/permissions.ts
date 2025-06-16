// TODO: Will it be extendable?
export const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  ENTERPRISE_CUSTOMER: 'enterprise_customer',
  SELF_SERVE_CUSTOMER: 'selfserve_customer',
  SDK_PARTNER: 'sdk_partner'
}

export type Role = (typeof ROLES)[keyof typeof ROLES]

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
  [role: Role]: {
    can: {
      [permission in Permissions]?: Resource[]
    }
  }
}

export type UserPermissionsResponse = {
  core: Array<{ resource: Resource; permission: Permissions }>
  override: Array<{ resource: Resource; permission: Permissions }>
}
