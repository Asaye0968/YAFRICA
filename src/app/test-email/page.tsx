// app/test-email/page.tsx
'use client'

import { useState } from 'react'

export default function TestEmail() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const sendTestEmail = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'asayemax1921@gmail.com',
          name: 'Test User',
          role: 'customer'
        })
      })
      
      const data = await res.json()
      setResult(res.ok ? '✅ Email sent! Check your inbox and spam.' : `❌ Failed: ${data.error}`)
    } catch (error) {
      setResult('❌ Error sending email')
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Email Test</h1>
      <button 
        onClick={sendTestEmail}
        disabled={loading}
        className="bg-yellow-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Test Email to asayemax1921@gmail.com'}
      </button>
      {result && <p className="mt-4 p-4 bg-gray-100 rounded">{result}</p>}
    </div>
  )
}