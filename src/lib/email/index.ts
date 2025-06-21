import { resendProvider } from './resend'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendVerificationOptions
  extends Omit<SendEmailOptions, 'subject' | 'html' | 'text'> {
  verificationUrl: string
}

export interface EmailProvider {
  send: (options: SendEmailOptions) => Promise<void>
  sendVerification: (options: SendVerificationOptions) => Promise<void>
}

const provider: EmailProvider = resendProvider

export const sendEmail = (options: SendEmailOptions) => provider.send(options)

export const sendVerificationEmail = (options: SendVerificationOptions) =>
  provider.sendVerification(options)

// TODO: separate
const getVerificationUrlBase = () => {
  return (
    process.env.VERIFICATION_URL_BASE || 'http://localhost:5173/auth/action'
  )
}

export function getVerificationUrl(email: string, token: string) {
  const base = getVerificationUrlBase()

  return `${base}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
}
