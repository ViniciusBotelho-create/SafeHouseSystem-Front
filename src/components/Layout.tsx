import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
  {
    to: '/persons',
    label: 'Moradores',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" fill="currentColor" opacity="0.8"/>
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      </svg>
    ),
  },
  {
    to: '/transactions',
    label: 'Transações',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 5h12M2 11h12M5 2l-3 3 3 3M11 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8"/>
      </svg>
    ),
  },
  {
    to: '/categories',
    label: 'Categorias',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4a2 2 0 012-2h1.5l1.5 2H12a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8"/>
      </svg>
    ),
  },
]

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--text)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L1 6v9h5v-4h4v4h5V6L8 1z" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', lineHeight: 1.2 }}>SafeHouse</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Sistema</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 13.5,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--text)' : 'var(--text-2)',
                background: isActive ? 'var(--surface-2)' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Versão 1.0.0</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', padding: '32px', maxWidth: 'calc(100vw - 220px)' }}>
        <Outlet />
      </main>
    </div>
  )
}
