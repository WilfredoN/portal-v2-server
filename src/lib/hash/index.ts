import { hash as bun } from './bun'

export interface Hash {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
}

export const encode: Hash = bun
