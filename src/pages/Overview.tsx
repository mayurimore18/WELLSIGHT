import { useState } from 'react';
import GISMap from '../components/GISMap';
import { wells, riskSignals, alerts, liveData, Well } from '../data/mockData';

interface OverviewProps {
  onNavigate: (page: string) => void;
  onSelectWell: (well: Well) => void;
}

const kpis = [
  {
    label: 'Active Well',
    value: 'OIL-XX-01',
    sub: '3,280 m · Drilling',
    color: '#1d4ed8',
    bg: '#eff6ff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    label: 'Nearby Wells',
    value: '12',
    sub: 'within 10 km',
    color: '#0f766e',
    bg: '#f0fdfa',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="1.8">
        <circle cx="12" cy="10" r="4" />
        <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" />
      </svg>
    ),
  },
  {
    label: 'Active Risk Signals',
    value: '03',
    sub: 'requiring attention',
    color: '#d97706',
    bg: '#fffbeb',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Historical Events',
    value: '27',
    sub: 'matched events',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: 'Risk Zones',
    value: '04',
    sub: 'depth intervals',
    color: '#dc2626',
    bg: '#fef2f2',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const liveParams = [
  { label: 'Depth', value: '3,280', unit: 'm', trend: null },
  { label: 'ROP', value: '18.4', unit: 'm/hr', trend: null },
  { label: 'Torque', value: '14,280', unit: 'ft·lb', trend: 'up' },
  { label: 'WOB', value: '24.6', unit: 'klbs', trend: null },
  { label: 'Mud Flow', value: '880', unit: 'gpm', trend: null },
  { label: 'SPP', value: '2,840', unit: 'psi', trend: 'up' },
];

export default function Overview({ onNavigate, onSelectWell }: OverviewProps) {
  const [radius, setRadius] = useState(10);
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const primaryRisk = riskSignals[0];

  const handleWellClick = (well: Well) => {
    setSelectedWell(well);
  };

  const handleViewIntelligence = (well: Well) => {
    onSelectWell(well);
    onNavigate('well-intelligence');
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>
            Drilling Intelligence Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Real-time awareness from current and nearby historical wells.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-xs px-2.5 py-1.5 rounded border outline-none"
            style={{ borderColor: '#e2e8f0', color: '#374151', backgroundColor: 'white' }}
          >
            <option>Upper Assam Block</option>
            <option>Jorhat Field</option>
            <option>Sibsagar Field</option>
          </select>
          <select
            className="text-xs px-2.5 py-1.5 rounded border outline-none"
            style={{ borderColor: '#e2e8f0', color: '#374151', backgroundColor: 'white' }}
          >
            <option>OIL-XX-01 (Active)</option>
            <option>OIL-XX-08</option>
          </select>
          <div
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border"
            style={{ borderColor: '#e2e8f0', color: '#64748b', backgroundColor: 'white' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>29 Sep 2026, 10:24</span>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md px-3 py-2.5"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-start justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: '#64748b' }}>
                {kpi.label}
              </span>
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: kpi.bg }}
              >
                {kpi.icon}
              </div>
            </div>
            <div
              className="text-xl font-bold font-mono"
              style={{ color: kpi.color, letterSpacing: '-0.02em' }}
            >
              {kpi.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 280px' }}>
        {/* Left column: Map + events */}
        <div className="space-y-3">
          {/* Map */}
          <div
            className="rounded-md overflow-hidden"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: '#f1f5f9' }}
            >
              <div>
                <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                  Nearby Well Intelligence Map
                </span>
                <span className="text-xs ml-2" style={{ color: '#94a3b8' }}>
                  XYZ Formation · Upper Assam Block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#64748b' }}>Radius:</span>
                {[5, 10, 20].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className="text-xs px-2 py-0.5 rounded font-medium transition-colors"
                    style={{
                      backgroundColor: radius === r ? '#1d4ed8' : '#f1f5f9',
                      color: radius === r ? 'white' : '#374151',
                    }}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3">
              <GISMap
                onWellClick={handleWellClick}
                selectedWellId={selectedWell?.id}
                radius={radius}
                showRiskZones={true}
                showFormations={true}
                height={400}
              />
            </div>
          </div>

          {/* Recent timeline */}
          <div
            className="rounded-md"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                Recent Intelligence Events
              </span>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-medium"
                style={{ color: '#1d4ed8' }}
              >
                View all alerts →
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {activeAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="flex flex-col items-center mt-0.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          alert.type === 'critical' ? '#dc2626' : alert.type === 'warning' ? '#d97706' : '#2563eb',
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: '#1e293b' }}>
                      {alert.title}
                    </div>
                    <div className="text-xs mt-0.5 line-clamp-1" style={{ color: '#64748b' }}>
                      {alert.description}
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0 font-mono" style={{ color: '#94a3b8' }}>
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Intelligence panel */}
        <div className="space-y-3">
          {/* Live data */}
          <div
            className="rounded-md"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                Current Drilling Intelligence
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#16a34a' }} />
                <span className="text-xs font-medium" style={{ color: '#16a34a' }}>LIVE</span>
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {liveParams.map((p) => (
                <div
                  key={p.label}
                  className="px-2.5 py-2 rounded"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
                >
                  <div className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>{p.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold font-mono" style={{ color: '#0f1e3b' }}>
                      {p.value}
                    </span>
                    <span className="text-xs" style={{ color: '#64748b' }}>{p.unit}</span>
                    {p.trend === 'up' && (
                      <span className="text-xs" style={{ color: '#d97706' }}>↑</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mx-3 mb-3 px-2.5 py-2 rounded text-xs"
              style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e' }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0f766e' }} />
                <span className="font-semibold">AI Monitoring Active</span>
              </div>
              Drilling conditions compared against {wells.filter(w => w.type === 'historical').length} offset wells in real-time.
            </div>
            <div className="px-3 pb-3">
              <div className="text-xs" style={{ color: '#94a3b8' }}>
                Last synchronized: 10:24:18 · Formation: XYZ Formation
              </div>
            </div>
          </div>

          {/* Primary risk card */}
          <div
            className="rounded-md overflow-hidden"
            style={{ border: '2px solid #fde68a' }}
          >
            <div
              className="px-3 py-2 flex items-center gap-2"
              style={{ backgroundColor: '#fffbeb' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs font-bold" style={{ color: '#92400e' }}>
                Potential Mud Loss Risk
              </span>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: '#fde68a', color: '#92400e' }}
              >
                MEDIUM
              </span>
            </div>
            <div className="px-3 py-3 bg-white space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Current Depth</div>
                  <div className="text-sm font-bold font-mono" style={{ color: '#0f1e3b' }}>3,280 m</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Matches</div>
                  <div className="text-sm font-bold font-mono" style={{ color: '#dc2626' }}>4 wells</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Risk Interval</div>
                  <div className="text-xs font-mono font-medium" style={{ color: '#1e293b' }}>3,200–3,350 m</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Confidence</div>
                  <div className="text-sm font-bold" style={{ color: '#0f766e' }}>{primaryRisk.confidence}%</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('risk-monitor')}
                className="w-full py-1.5 text-xs font-semibold rounded text-white transition-colors"
                style={{ backgroundColor: '#d97706' }}
              >
                View Risk Analysis
              </button>
            </div>
          </div>

          {/* Institutional memory */}
          <div
            className="rounded-md"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                Learned from Nearby Wells
              </span>
            </div>
            <div className="p-3 space-y-2.5">
              {[
                {
                  icon: '◉',
                  color: '#dc2626',
                  text: '4 nearby wells experienced mud loss in XYZ Formation at 3,200–3,350 m.',
                },
                {
                  icon: '◉',
                  color: '#d97706',
                  text: '2 wells encountered stuck pipe in deeper sandstone zones.',
                },
                {
                  icon: '◉',
                  color: '#0f766e',
                  text: 'Previous mitigation: LCM pills + controlled ECD.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic statement */}
          <div
            className="rounded-md px-3 py-3"
            style={{ backgroundColor: '#0f1e3b' }}
          >
            <p className="text-xs leading-relaxed text-center" style={{ color: '#94a3b8' }}>
              <span style={{ color: '#38bdf8', fontWeight: '600' }}>
                From historical experience to real-time action.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
