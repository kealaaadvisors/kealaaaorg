'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CRM_URL          = process.env.CRM_URL      || 'https://ops.keala.io'
const RESEARCH_URL     = process.env.RESEARCH_URL || 'https://research.keala.io'
const QUESTIONAIRE_URL = process.env.RESEARCH_URL || 'https://questionnaire.keala.io'

export default function DashboardPage() {
  const [name, setName] = useState('there')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const display = user.user_metadata?.username || user.email?.split('@')[0] || 'there'
        setName(display)
      }
    })
  }, [])

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: 1100 }}>

    

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Internal Portal
        </p>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
          Welcome back, {name}
        </h1>
      </div>

      {/* Platform cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <PlatformCard
          href={CRM_URL}
          title="CRM & Workflow"
          description="Manage contacts, deals, tasks, and operational workflows."
          tag="crm.keala.io"
        />
        <PlatformCard
          href={RESEARCH_URL}
          title="Research Database"
          description="Investment research, analysis, and data repository."
          tag="research.keala.io"
        />
        <PlatformCard
          href={QUESTIONAIRE_URL}
          title="Questionaire"
          description="Investment research, analysis, and data repository."
          tag="questionnaire.keala.io"
        />
      </div>

    </div>
  )
}

function PlatformCard({
  href,
  title,
  description,
  tag,
}: {
  href: string
  title: string
  description: string
  tag: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.5rem',
        textDecoration: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#d1d5db'
        el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#e5e7eb'
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{title}</h2>
        <ArrowUpRight size={16} color="#9ca3af" />
      </div>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        {description}
      </p>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.7rem',
        color: '#9ca3af',
        letterSpacing: '0.03em',
      }}>
        {tag}
      </span>
    </a>
  )
}
