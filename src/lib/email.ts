// // src/lib/email.ts
// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD
//   },
//   connectionTimeout: 10000, // 10 seconds
//   socketTimeout: 15000, // 15 seconds
//   greetingTimeout: 5000, // 5 seconds
// })

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
// }

// export async function sendEmail({ to, subject, html }: SendEmailParams) {
//   try {
//     const result = await transporter.sendMail({
//       from: '"Yafrican" <asayemax1921@gmail.com>', // Hardcoded for consistent display
//       to,
//       subject,
//       html,
//     })
    
//     console.log('Email sent to:', to)
//     return result
//   } catch (error) {
//     console.error(' Email sending failed:', error)
//     throw error
//   }
// }
// src/lib/email.ts
// lib/email.ts
import nodemailer from 'nodemailer'

const isProduction = process.env.NODE_ENV === 'production';

// Correct Brevo SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Use this for both dev and prod
  port: 587, // Use 587 for both dev and prod
  secure: false, // false for 587, true for 465
  auth: {
    user: process.env.BREVO_SMTP_USER, // Your Brevo SMTP login
    pass: process.env.BREVO_SMTP_KEY, // Your Brevo SMTP key
  },
  connectionTimeout: 10000,
  socketTimeout: 15000,
  greetingTimeout: 5000,
})

// Test connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP Connection failed:', error.message)
  } else {
    console.log('✅ SMTP Server is ready to send emails')
    console.log('📧 Using SMTP:', process.env.BREVO_SMTP_USER)
  }
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    console.log(`📨 Attempting to send email to: ${to}`)
    console.log(`🔧 Using SMTP user: ${process.env.BREVO_SMTP_USER}`)

    const result = await transporter.sendMail({
from: '"Yafrican" <asayemax1921@gmail.com>', // Use your verified Gmail
      to,
      subject,
      html,
    })
    
    console.log('✅ Email sent successfully to:', to)
    console.log('📫 Message ID:', result.messageId)
    return result
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    throw error
  }
}