/* eslint-disable unicorn/filename-case */
import * as React from 'react'

export interface VerificationEmailProps {
  verificationUrl: string
}

export function VerificationEmail(props: VerificationEmailProps) {
  const { verificationUrl } = props

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222' }}>
      <h2>Verify your email address</h2>
      <p>Please verify your email by clicking the link below:</p>
      <p>
        <a href={verificationUrl} style={{ color: '#2563eb' }}>
          {verificationUrl}
        </a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  )
}
