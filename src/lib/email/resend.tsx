import { render } from '@react-email/render'
import { Resend } from 'resend'

import type {
  EmailProvider,
  SendEmailOptions,
  SendVerificationOptions
} from './index'

import { logger } from '../logger'
import { VerificationEmail } from './templates/VerificationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const resendProvider: EmailProvider = {
  send: async ({ to, subject, html, text }: SendEmailOptions) => {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html,
        text
      })
    } catch (error) {
      logger.fatal('Error sending email:', error)
    }
  },
  sendVerification: async ({
    to,
    verificationUrl
  }: SendVerificationOptions) => {
    const subject = 'Verify your email address'
    const html = await render(
      <VerificationEmail verificationUrl={verificationUrl} />
    )
    const text = `Please verify your email: ${verificationUrl}`
    await resendProvider.send({ to, subject, html, text })
  }
}
