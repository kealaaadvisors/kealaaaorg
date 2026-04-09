'use client'

import { useState, useEffect, useRef } from 'react'
import { User, X, Camera, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function UserMenu() {
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleOpenModal() { openModal() }
    window.addEventListener('open-profile-modal', handleOpenModal)
    return () => window.removeEventListener('open-profile-modal', handleOpenModal)
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setEmail(user.email ?? '')
      setUsername(user.user_metadata?.username ?? '')
      setAvatarUrl(user.user_metadata?.avatar_url ?? null)
    }
  }

  function openModal() {
    setMenuOpen(false)
    setAvatarPreview(null)
    setAvatarFile(null)
    setStatus(null)
    setModalOpen(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      let newAvatarUrl = avatarUrl

      if (avatarFile) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const ext = avatarFile.name.split('.').pop()
        const path = `${user.id}/avatar.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)

        newAvatarUrl = publicUrl
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: { username, avatar_url: newAvatarUrl },
      })
      if (metaError) throw metaError

      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser && email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) throw emailError
        setStatus({ type: 'success', msg: 'Saved! Check your new email for a confirmation link.' })
      } else {
        setStatus({ type: 'success', msg: 'Profile updated successfully.' })
      }

      setAvatarUrl(newAvatarUrl)
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setStatus({ type: 'error', msg: message })
    } finally {
      setLoading(false)
    }
  }

  const displayAvatar = avatarPreview ?? avatarUrl
  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email
    ? email.slice(0, 2).toUpperCase()
    : '?'

  return (
    <>
      {/* Avatar button */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.1)',
            background: displayAvatar ? 'transparent' : '#1e2330',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          {displayAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.02em' }}>
              {initials}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#1a1d24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            minWidth: 188,
            zIndex: 100,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
                {username || 'User'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#4a5568', margin: '0.15rem 0 0' }}>
                {email}
              </p>
            </div>
            <button
              onClick={openModal}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.82rem',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.1s, color 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = '#e2e8f0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              <User size={13} />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div style={{
            background: '#16191f',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                padding: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5568')}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>
              Edit Profile
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '1.75rem' }}>
              Update your username, email, or photo.
            </p>

            {/* Avatar upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: 80, height: 80 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#1e2330',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayAvatar} alt="avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#374151' }}>
                      {initials}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#374151',
                    border: '2px solid #16191f',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#4b5563')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#374151')}
                >
                  <Camera size={12} color="#d1d5db" />
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#374151', marginTop: '0.5rem' }}>
                Click camera to upload photo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>

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

              {status && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 8,
                  background: status.type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(252,129,129,0.08)',
                  border: `1px solid ${status.type === 'success' ? 'rgba(52,211,153,0.2)' : 'rgba(252,129,129,0.2)'}`,
                }}>
                  {status.type === 'success'
                    ? <Check size={14} color="#34d399" style={{ flexShrink: 0, marginTop: 1 }} />
                    : <AlertCircle size={14} color="#fc8181" style={{ flexShrink: 0, marginTop: 1 }} />
                  }
                  <span style={{ fontSize: '0.78rem', color: status.type === 'success' ? '#34d399' : '#fc8181', lineHeight: 1.5 }}>
                    {status.msg}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                  color: loading ? '#4a5568' : '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '0.65rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: '#4a5568',
  marginBottom: '0.35rem',
  fontWeight: 500,
  letterSpacing: '0.03em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '0.6rem 0.8rem',
  color: '#e2e8f0',
  fontSize: '0.875rem',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
