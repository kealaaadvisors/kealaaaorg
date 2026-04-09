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

      // Upload photo if changed
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

      // Update user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          username,
          avatar_url: newAvatarUrl,
        },
      })
      if (metaError) throw metaError

      // Update email if changed
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser && email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) throw emailError
        setStatus({ type: 'success', msg: 'Saved! Check your new email address for a confirmation link.' })
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
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '2px solid #dce6f0',
            background: displayAvatar ? 'transparent' : '#eaf3fa',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#5BA4CF')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#dce6f0')}
        >
          {displayAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayAvatar}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#5BA4CF', letterSpacing: '0.02em' }}>
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
            background: '#ffffff',
            border: '1px solid #dce6f0',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(30,58,82,0.12)',
            minWidth: 180,
            zIndex: 100,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eef3f8' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e3a52', margin: 0 }}>
                {username || 'User'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#7a97b0', margin: '0.15rem 0 0' }}>
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
                color: '#1e3a52',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f6fb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <User size={13} color="#5BA4CF" />
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
            background: 'rgba(15,28,40,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(2px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 8px 40px rgba(30,58,82,0.18)',
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
                color: '#7a97b0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                padding: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1e3a52')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#7a97b0')}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e3a52', marginBottom: '0.25rem' }}>
              Edit Profile
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#7a97b0', marginBottom: '1.75rem' }}>
              Update your username, email, or photo.
            </p>

            {/* Avatar upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: 80, height: 80 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: displayAvatar ? 'transparent' : '#eaf3fa',
                  border: '2px solid #dce6f0',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayAvatar}
                      alt="avatar preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#5BA4CF' }}>
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
                    background: '#5BA4CF',
                    border: '2px solid #ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#4a8fb8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#5BA4CF')}
                >
                  <Camera size={12} color="#fff" />
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#7a97b0', marginTop: '0.5rem' }}>
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
              {/* Username */}
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

              {/* Email */}
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

              {/* Status */}
              {status && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 8,
                  background: status.type === 'success' ? 'rgba(91,164,207,0.08)' : 'rgba(224,82,82,0.08)',
                  border: `1px solid ${status.type === 'success' ? 'rgba(91,164,207,0.25)' : 'rgba(224,82,82,0.25)'}`,
                }}>
                  {status.type === 'success'
                    ? <Check size={14} color="#5BA4CF" style={{ flexShrink: 0, marginTop: 1 }} />
                    : <AlertCircle size={14} color="#e05252" style={{ flexShrink: 0, marginTop: 1 }} />
                  }
                  <span style={{ fontSize: '0.78rem', color: status.type === 'success' ? '#2e7db5' : '#e05252', lineHeight: 1.5 }}>
                    {status.msg}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(91,164,207,0.4)' : '#5BA4CF',
                  color: loading ? 'rgba(255,255,255,0.5)' : '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.65rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: '0.25rem',
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
  color: '#7a97b0',
  marginBottom: '0.35rem',
  fontWeight: 500,
  letterSpacing: '0.03em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f7fafd',
  border: '1px solid #dce6f0',
  borderRadius: 8,
  padding: '0.6rem 0.8rem',
  color: '#1e3a52',
  fontSize: '0.875rem',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
