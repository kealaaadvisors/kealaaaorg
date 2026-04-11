'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Session present = email confirmation disabled, go straight to dashboard
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Email confirmation required
    setMessage('Account created! Check your email to confirm, then sign in.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f0f4f8' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-10" style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/newLogo.jpeg"
            alt="Keala Advisors"
            width={200}
            height={50}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #dce6f0',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(91,164,207,0.08)',
        }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e3a52', marginBottom: '0.25rem' }}>
            Create account
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#7a97b0', marginBottom: '1.75rem' }}>
            Request access to the internal portal
          </p>

          {message ? (
            <p style={{
              fontSize: '0.875rem',
              color: '#2e7d32',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              padding: '0.75rem 1rem',
            }}>
              {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@keala.io"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
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
                <p style={{ fontSize: '0.8rem', color: '#e05252', marginTop: '-0.25rem' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle(loading)}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#7a97b0' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#5BA4CF', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#5a7a94',
  marginBottom: '0.4rem',
  letterSpacing: '0.03em',
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f5f9fc',
  border: '1px solid #c8dcea',
  borderRadius: 8,
  padding: '0.65rem 0.85rem',
  color: '#1e3a52',
  fontSize: '0.9rem',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: '100%',
  background: loading ? '#c8dcea' : '#5BA4CF',
  color: loading ? '#7a97b0' : '#ffffff',
  border: 'none',
  borderRadius: 8,
  padding: '0.7rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
  cursor: loading ? 'not-allowed' : 'pointer',
  marginTop: '0.25rem',
  transition: 'background 0.15s',
  letterSpacing: '0.01em',
})
