// TODO: potentailly to move to src/constants or smth.
export const ROLES = [
  'superadmin',
  'admin',
  'enterprise_customer',
  'selfserve_customer',
  'sdk_partner'
] as const

export type Role = (typeof ROLES)[number]
