import { Sidebar } from '@/components/Sidebar'
import { UserMenu } from '@/components/UserMenu'
import { MobileNav } from '@/components/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f7fa', overflow: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <div className="topbar" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0.85rem 1.5rem',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}>
          <MobileNav />
          <div style={{ flex: 1 }} className="mobile-spacer" />
          <UserMenu />
        </div>
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
