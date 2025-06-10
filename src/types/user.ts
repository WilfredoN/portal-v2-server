import type { userRoleEnum, userStatusEnum } from '../db/schema'

export type UserStatus = (typeof userStatusEnum.enumValues)[number]

export type UserRole = (typeof userRoleEnum.enumValues)[number]

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  status: UserStatus
  role: UserRole | null
}
// or just 'Auth'?
export type UserAuth = {
  id: string
  userId: string
  identifier: string
  createdAt: Date
  provider: string
  password?: string
}

export type SignUpDTO = {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type LoginDTO = {
  email: string
  password: string
}
