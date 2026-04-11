'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push('/login?reset=success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1b1b1b' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-10" style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/newLogo.jpeg"
            alt="Keala Advisors"
            width={180}
            height={44}
            style={{ objectFit: 'contain', borderRadius: 4 }}
          />
        </div>

        {/* Card */}
        <div style={{
          background: '#242424',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          padding: '2rem',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.88), 0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: '#dcdad5', marginBottom: '0.25rem' }}>
            Set new password
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#7a7872', marginBottom: '1.75rem' }}>
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={labelStyle}>New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.78rem', color: '#e05252', marginTop: '-0.1rem' }}>{error}</p>
            )}

            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: '#9a9790',
  marginBottom: '0.4rem',
  letterSpacing: '0.03em',
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '0.6rem 0.8rem',
  color: '#c5c1b9',
  fontSize: '0.875rem',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s cubic-bezier(0.4,0,0.2,1)',
  boxSizing: 'border-box',
}

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: '100%',
  background: loading ? 'rgba(87,94,207,0.4)' : '#575ECF',
  color: loading ? 'rgba(255,255,255,0.4)' : '#ffffff',
  border: 'none',
  borderRadius: 6,
  padding: '0.65rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  cursor: loading ? 'not-allowed' : 'pointer',
  marginTop: '0.15rem',
  transition: 'background 0.2s cubic-bezier(0.4,0,0.2,1)',
  letterSpacing: '0.01em',
})
