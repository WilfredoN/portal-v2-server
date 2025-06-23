export interface JWTPayload {
  sub: string
  email: string
  role: string | null
  exp: number
  iat?: number
}

export interface AppContext {
  Variables: {
    jwtPayload: JWTPayload
  }
}
