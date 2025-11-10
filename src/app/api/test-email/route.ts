// app/api/test-email/route.ts
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function GET() {
  try {
    console.log('🧪 Testing email configuration...')
    console.log('SMTP User:', process.env.BREVO_SMTP_USER)
    console.log('NODE_ENV:', process.env.NODE_ENV)

    await sendEmail({
      to: 'asayemax1921@gmail.com', // Change to your email
      subject: 'Yafrican - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #f59e0b;">✅ Yafrican Email Test</h1>
          <p>This is a test email from your Yafrican application.</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <hr>
          <p><small>If you receive this, your Brevo SMTP is working!</small></p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!' 
    })
  } catch (error: any) {
    console.error('❌ Test email failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: 'Check your Brevo SMTP configuration' 
    }, { status: 500 })
  }
}