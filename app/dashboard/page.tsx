'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CRM_URL      = process.env.CRM_URL      || 'https://ops.keala.io'
const RESEARCH_URL = process.env.RESEARCH_URL || 'https://research.keala.io'
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
    <div style={{ padding: '2.5rem 2rem', maxWidth: 720 }}>

      {/* Logo */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Image
          src="/kealalogo.jpeg"
          alt="Keala Advisors"
          width={180}
          height={45}
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#7a97b0', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Internal Portal
        </p>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#1e3a52', lineHeight: 1.2 }}>
          Welcome back, {name}
        </h1>
      </div>

      {/* Platform cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
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
        />    <PlatformCard
          href={QUESTIONAIRE_URL}
          title="Questionaire"
          description="Investment research, analysis, and data repository."
          tag="Questionaire.keala.io"
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
        border: '1px solid #dce6f0',
        borderRadius: 12,
        padding: '1.5rem',
        textDecoration: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        boxShadow: '0 1px 6px rgba(91,164,207,0.06)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#5BA4CF'
        el.style.boxShadow = '0 4px 16px rgba(91,164,207,0.15)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#dce6f0'
        el.style.boxShadow = '0 1px 6px rgba(91,164,207,0.06)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a52' }}>{title}</h2>
        <ArrowUpRight size={16} color="#5BA4CF" />
      </div>
      <p style={{ fontSize: '0.85rem', color: '#7a97b0', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        {description}
      </p>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.7rem',
        color: '#5BA4CF',
        letterSpacing: '0.03em',
      }}>
        {tag}
      </span>
    </a>
  )
}
