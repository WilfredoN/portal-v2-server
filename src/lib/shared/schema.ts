import { z } from 'zod'
import { PASSWORD_REGEX } from './constants'

const email = z.string().email({ message: 'Invalid email format.' })
const password = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters.' })
  .regex(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character.'
  })
const firstName = z
  .string()
  .min(1, { message: 'First name is required.' })
  .max(50, { message: 'First name must be at most 50 characters.' })
const lastName = z
  .string()
  .min(1, { message: 'Last name is required.' })
  .max(50, { message: 'Last name must be at most 50 characters.' })

export { email, password, firstName, lastName }
