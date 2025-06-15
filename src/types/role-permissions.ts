import { RESOURCES, type RolePermissions } from './permissions'

export const ROLE_PERMISSIONS: RolePermissions = {
  superadmin: {
    can: {
      view: [
        RESOURCES.USERS,
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      create: [
        RESOURCES.USERS,
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      edit: [
        RESOURCES.USERS,
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      delete: [
        RESOURCES.USERS,
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ]
    }
  },
  admin: {
    can: {
      view: [
        RESOURCES.USERS,
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      create: [
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      edit: [
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      delete: [
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ]
    }
  },
  enterprise_customer: {
    can: {
      view: [
        RESOURCES.RESIDENTIAL_PLANS,
        RESOURCES.ISP_PLANS,
        RESOURCES.SERP_PLANS
      ],
      create: [RESOURCES.SERP_PLANS],
      edit: [RESOURCES.SERP_PLANS]
    }
  },
  selfserve_customer: {
    can: {
      view: [RESOURCES.RESIDENTIAL_PLANS, RESOURCES.ISP_PLANS],
      create: [],
      edit: []
    }
  },
  sdk_partner: {
    can: {
      view: [RESOURCES.SERP_PLANS],
      create: [],
      edit: []
    }
  }
}
