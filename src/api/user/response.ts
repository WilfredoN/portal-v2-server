import type { Permissions, Resource } from '@src/types/permissions'

export interface UserPermissionsResponse {
  core: Array<{ resource: Resource, permission: Permissions }>
  override: Array<{ resource: Resource, permission: Permissions }>
}
