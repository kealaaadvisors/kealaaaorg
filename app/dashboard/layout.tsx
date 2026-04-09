import { Sidebar } from '@/components/Sidebar'
import { UserMenu } from '@/components/UserMenu'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111318' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111318', overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0.85rem 1.5rem',
          background: '#16191f',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <UserMenu />
        </div>
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
