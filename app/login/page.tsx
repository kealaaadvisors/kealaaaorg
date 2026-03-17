'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const supabase = createClient()

    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInError) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // If credentials are wrong (account doesn't exist), try sign up
    if (signInError.message === 'Invalid login credentials') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      setLoading(false)

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If session exists, email confirmation is disabled — go straight to dashboard
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
        return
      }

      // Email confirmation required
      setMessage('Account created! Check your email to confirm, then sign in.')
      return
    }

    // Other sign-in errors (e.g. wrong password for existing account)
    setLoading(false)
    setError(signInError.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f0f4f8' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-10" style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/kealalogo.jpeg"
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
            Sign in
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#7a97b0', marginBottom: '1.75rem' }}>
            Access the internal portal — new users will be registered automatically
          </p>

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
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#e05252', marginTop: '-0.25rem' }}>{error}</p>
            )}
            {message && (
              <p style={{ fontSize: '0.8rem', color: '#2e7d32', marginTop: '-0.25rem' }}>{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle(loading)}
            >
              {loading ? 'Please wait…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#7a97b0' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#5BA4CF', textDecoration: 'none', fontWeight: 500 }}>
            Create one
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
