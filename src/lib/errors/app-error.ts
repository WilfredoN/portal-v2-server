import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { getReasonPhrase } from 'http-status-codes'

export type AppErrorCode
  = | 'auth/invalid-credentials'
    | 'auth/user-not-found'
    | 'auth/user-exists'
    | 'auth/unauthorized'
    | 'auth/forbidden'
    | 'db/connection-failed'
    | 'db/not-found'
    | 'validation/failed'
    | 'internal/server-error'
    | string

export interface AppError {
  code: AppErrorCode
  message?: string
  status: number
  details?: unknown
  isApplicationError: true
}

export const appError = (
  code: AppErrorCode,
  status: ContentfulStatusCode,
  details?: unknown,
): AppError => ({
  code,
  message: getReasonPhrase(status),
  status,
  details,
  isApplicationError: true,
})
