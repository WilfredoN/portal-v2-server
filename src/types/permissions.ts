// TODO: Will it be extendable?
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPERADMIN: 'superadmin',
  ENTERPRISE_CUSTOMER: 'enterprise_customer',
  SELF_SERVE_CUSTOMER: 'selfserve_customer',
  SDK_PARTNER: 'sdk_partner'
}

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const RESOURCES = {
  USERS: 'users',
  PLANS: 'plans',
  RESIDENTIAL_PLANS: 'residential_plans',
  ISP_PLANS: 'isp_plans',
  SERP_PLANS: 'serp_plans'
} as const

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES]

export const ACTIONS = {
  CREATE: 'create',
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete'
} as const

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS]

export type RolePermissions = {
  [role: string]: {
    can: {
      [action in Action]?: Resource[]
    }
  }
}

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: {
    can: {
      view: ['users', 'plans', 'residential_plans', 'isp_plans', 'serp_plans'],
      create: ['plans'],
      edit: ['plans'],
      delete: ['users']
    }
  },
  user: {
    can: {
      view: ['plans', 'residential_plans', 'isp_plans', 'serp_plans']
    }
  }
}
