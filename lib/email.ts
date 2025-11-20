import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    await resend.emails.send({
      from: 'LinkBio <noreply@yourdomain.com>',
      to: email,
      subject: 'Welcome to LinkBio!',
      html: `
        <h1>Welcome to LinkBio, ${username}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Start building your link-in-bio page now: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: 'LinkBio <noreply@yourdomain.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send password reset email:', error)
  }
}
