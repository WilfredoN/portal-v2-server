import type { Hash } from '.'

export const hash: Hash = {
  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    })
  },

  async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash)
  },
}
