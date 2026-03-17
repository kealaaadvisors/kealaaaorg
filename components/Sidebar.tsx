'use client'

import Image from 'next/image'
import { useState } from 'react'
import { LayoutGrid, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CRM_URL      = process.env.NEXT_PUBLIC_CRM_URL      || 'https://crm.keala.io'
const RESEARCH_URL = process.env.NEXT_PUBLIC_RESEARCH_URL || 'https://research.keala.io'

export function Sidebar() {
  const [featuresOpen, setFeaturesOpen] = useState(true)
  const router = useRouter()

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #dce6f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
        <Image
          src="/kealalogo.jpeg"
          alt="Keala Advisors"
          width={160}
          height={40}
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>

        <div style={{ marginBottom: '0.25rem' }}>
          <button
            onClick={() => setFeaturesOpen(!featuresOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.55rem 0.75rem',
              borderRadius: 7,
              border: 'none',
              background: 'transparent',
              color: '#7a97b0',
              fontSize: '0.78rem',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            <LayoutGrid size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Features</span>
            <ChevronDown
              size={13}
              style={{
                transition: 'transform 0.2s',
                transform: featuresOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
          </button>

          {featuresOpen && (
            <div style={{ marginTop: '0.25rem', paddingLeft: '0.5rem' }}>
              <NavLink href={CRM_URL} label="CRM & Workflow" />
              <NavLink href={RESEARCH_URL} label="Research Database" />
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 0.75rem' }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.55rem 0.75rem',
            borderRadius: 7,
            border: 'none',
            background: 'transparent',
            color: '#aac4d8',
            fontSize: '0.82rem',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e05252')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#aac4d8')}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        borderRadius: 7,
        color: '#5a7a94',
        fontSize: '0.875rem',
        fontFamily: 'DM Sans, sans-serif',
        textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s',
        marginBottom: '0.1rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#eaf3fa'
        e.currentTarget.style.color = '#2e7db5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#5a7a94'
      }}
    >
      <span style={{
        width: 5, height: 5,
        borderRadius: '50%',
        background: '#5BA4CF',
        flexShrink: 0,
      }} />
      {label}
    </a>
  )
}
