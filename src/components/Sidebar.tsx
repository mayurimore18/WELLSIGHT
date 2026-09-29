import { useState } from 'react';

type Page =
  | 'overview'
  | 'nearby-wells'
  | 'active-well'
  | 'well-intelligence'
  | 'risk-monitor'
  | 'knowledge-base'
  | 'reports'
  | 'alerts';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  alertCount: number;
}

const navItems: Array<{ id: Page; label: string; icon: React.ReactNode }> = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'nearby-wells',
    label: 'Nearby Wells',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="10" r="4" />
        <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" />
      </svg>
    ),
  },
  {
    id: 'active-well',
    label: 'Active Well',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    id: 'well-intelligence',
    label: 'Well Intelligence',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'risk-monitor',
    label: 'Risk Monitor',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: 'Help',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentPage, onNavigate, alertCount }: SidebarProps) {
  const [collapsed] = useState(false);

  return (
    <div
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{
        width: collapsed ? '56px' : '220px',
        backgroundColor: '#0f1e3b',
        borderRight: '1px solid #1a3260',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: '#1a3260', minHeight: '56px' }}>
        <div
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#1a3260' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="16" width="2" height="7" fill="#38bdf8" />
            <rect x="11" y="10" width="2" height="13" fill="#38bdf8" />
            <rect x="18" y="13" width="2" height="10" fill="#38bdf8" />
            <circle cx="5" cy="14" r="2" fill="#0ea5e9" />
            <circle cx="12" cy="8" r="2" fill="#0ea5e9" />
            <circle cx="19" cy="11" r="2" fill="#0ea5e9" />
            <path d="M5 14 L12 8 L19 11" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 1.5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm tracking-tight leading-none">eRTMAC-NWIS</div>
            <div className="text-xs leading-tight mt-0.5 truncate" style={{ color: '#64748b', fontSize: '10px' }}>
              Nearby Wells Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all relative"
                style={{
                  backgroundColor: isActive ? '#1a3260' : 'transparent',
                  color: isActive ? '#e2e8f0' : '#64748b',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#141f38';
                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#64748b';
                  }
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ backgroundColor: '#38bdf8' }}
                  />
                )}
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-xs font-medium truncate">{item.label}</span>
                )}
                {item.id === 'alerts' && alertCount > 0 && !collapsed && (
                  <span
                    className="ml-auto text-white text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: '#dc2626', fontSize: '10px', lineHeight: '1.2' }}
                  >
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section divider */}
        <div className="mx-4 my-3 border-t" style={{ borderColor: '#1a3260' }} />

        <div className="px-3 space-y-0.5">
          {!collapsed && (
            <div className="px-2.5 pb-1">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#334155', fontSize: '9px' }}>
                System
              </span>
            </div>
          )}
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#141f38';
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#475569';
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-xs font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* User profile */}
      <div className="border-t px-3 py-3" style={{ borderColor: '#1a3260' }}>
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer"
          style={{ color: '#64748b' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#141f38'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs"
            style={{ backgroundColor: '#1d4ed8' }}
          >
            RS
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">R. Sharma</div>
              <div className="text-xs truncate" style={{ color: '#475569', fontSize: '10px' }}>
                Drilling Engineer
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
