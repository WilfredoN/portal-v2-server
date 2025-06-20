import type { ContentfulStatusCode } from 'hono/utils/http-status'

export interface ApiMeta {
  [key: string]: unknown
}

export interface ApiErrorDetails {
  message: string
  code?: string | number
  details?: unknown
  field?: string
  type?: string
}

export interface ApiResponseBase {
  success: boolean
  code: ContentfulStatusCode
  meta?: ApiMeta
  timestamp: string
  path?: string
}

export interface ApiSuccessResponse<T = unknown> extends ApiResponseBase {
  success: true
  data: T
  error: null
}

export interface ApiErrorResponse extends ApiResponseBase {
  success: false
  data: null
  error: ApiErrorDetails | ApiErrorDetails[]
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Returns the current timestamp in ISO format.
 */
const now = () => new Date().toISOString()

/**
 * Extracts the request path from a context object or string.
 * @param input Context object or string path.
 * @returns The path string, if available.
 */
const extractPath = (input?: { req?: { path?: string } } | string): string | undefined => {
  if (!input) {
    return undefined
  }
  if (typeof input === 'string') {
    return input
  }
  return input.req?.path
}

/**
 * Creates a standardized API success response.
 * @template T Type of the response data.
 * @param data The response data.
 * @param code HTTP status code (default: 200).
 * @param meta Optional metadata.
 * @param context Optional context or path.
 * @returns ApiSuccessResponse<T>
 */
export const success = <T>(
  data: T,
  code: ContentfulStatusCode = 200,
  meta?: ApiMeta,
  context?: { req?: { path?: string } } | string,
): ApiSuccessResponse<T> => ({
  success: true,
  code,
  data,
  error: null,
  timestamp: now(),
  ...(meta ? { meta } : {}),
  ...(extractPath(context) ? { path: extractPath(context) } : {}),
})

/**
 * Creates a standardized API error response.
 * @param code HTTP status code.
 * @param message Error message.
 * @param details Optional error details.
 * @param errorCode Optional error code.
 * @param meta Optional metadata.
 * @param context Optional context or path.
 * @param field Optional field related to the error.
 * @param type Optional error type.
 * @returns ApiErrorResponse
 */
export const error = (
  code: ContentfulStatusCode,
  message: string,
  details?: unknown,
  errorCode?: string | number,
  meta?: ApiMeta,
  context?: { req?: { path?: string } } | string,
  field?: string,
  type?: string,
): ApiErrorResponse => ({
  success: false,
  code,
  data: null,
  error: [{ message, code: errorCode, ...(details ? { details } : {}), ...(field ? { field } : {}), ...(type ? { type } : {}) }],
  timestamp: now(),
  ...(meta ? { meta } : {}),
  ...(extractPath(context) ? { path: extractPath(context) } : {}),
})
