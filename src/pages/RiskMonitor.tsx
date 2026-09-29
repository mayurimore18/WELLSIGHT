import { useState } from 'react';
import { riskSignals, wells, knowledgeBaseEntries } from '../data/mockData';

interface RiskMonitorProps {
  onNavigate: (page: string) => void;
}

const riskLevelStyles = {
  low: { bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', text: '#166534', label: 'LOW' },
  medium: { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', text: '#92400e', label: 'MEDIUM' },
  high: { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#991b1b', label: 'HIGH' },
  critical: { bg: '#fef2f2', border: '#fca5a5', dot: '#dc2626', text: '#7f1d1d', label: 'CRITICAL' },
};

function RiskTimeline({ currentDepth, zoneStart, zoneEnd }: { currentDepth: number; zoneStart: number; zoneEnd: number }) {
  const minD = 2500;
  const maxD = 4500;
  const range = maxD - minD;
  const toPercent = (d: number) => ((d - minD) / range) * 100;
  const currentPct = toPercent(currentDepth);
  const zonePct = toPercent(zoneStart);
  const zoneWidthPct = toPercent(zoneEnd) - toPercent(zoneStart);

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1" style={{ color: '#94a3b8' }}>
        <span className="font-mono">{minD.toLocaleString()} m</span>
        <span className="text-xs" style={{ color: '#64748b' }}>Depth Profile</span>
        <span className="font-mono">{maxD.toLocaleString()} m</span>
      </div>
      <div className="relative h-5 rounded-md overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
        {/* Drilled section */}
        <div
          className="absolute top-0 left-0 h-full rounded-l-md"
          style={{ width: `${currentPct}%`, backgroundColor: '#bfdbfe' }}
        />
        {/* Risk zone */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${zonePct}%`,
            width: `${zoneWidthPct}%`,
            backgroundColor: '#fde68a',
            opacity: 0.8,
          }}
        />
        {/* Current depth indicator */}
        <div
          className="absolute top-0 h-full w-0.5"
          style={{ left: `${currentPct}%`, backgroundColor: '#dc2626' }}
        />
        <div
          className="absolute bottom-0 text-xs font-bold"
          style={{ left: `${currentPct}%`, transform: 'translateX(-50%)', color: '#dc2626', lineHeight: '20px' }}
        >
          ▲
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span style={{ color: '#94a3b8' }}>◀ Past</span>
        <div
          style={{ position: 'absolute', marginLeft: `${zonePct}%`, color: '#d97706' }}
          className="text-xs font-mono"
        >
          {zoneStart.toLocaleString()}–{zoneEnd.toLocaleString()} m
        </div>
        <span style={{ color: '#94a3b8' }}>Future ▶</span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded" style={{ backgroundColor: '#bfdbfe' }} />
          <span style={{ color: '#64748b' }}>Drilled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded" style={{ backgroundColor: '#fde68a' }} />
          <span style={{ color: '#64748b' }}>Historical Risk Interval</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-3" style={{ backgroundColor: '#dc2626' }} />
          <span style={{ color: '#64748b' }}>Current Depth</span>
        </div>
      </div>
    </div>
  );
}

export default function RiskMonitor({ onNavigate }: RiskMonitorProps) {
  const [selectedRisk, setSelectedRisk] = useState(riskSignals[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  const riskCategories = [
    { id: 'mud-loss', label: 'Mud Loss', count: 4, level: 'medium' as const },
    { id: 'stuck-pipe', label: 'Stuck Pipe', count: 2, level: 'low' as const },
    { id: 'overpressure', label: 'Overpressure', count: 1, level: 'low' as const },
    { id: 'high-torque', label: 'High Torque', count: 3, level: 'low' as const },
    { id: 'cementing', label: 'Cementing Issue', count: 2, level: 'low' as const },
  ];

  const evidenceWells = selectedRisk.affectedWells
    .map((id) => wells.find((w) => w.id === id))
    .filter(Boolean);

  const relatedKB = knowledgeBaseEntries.filter((e) =>
    e.event.toLowerCase().includes('mud loss') && selectedRisk.type === 'Mud Loss'
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>Drilling Risk Monitor</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          AI-powered risk assessment based on current depth and historical offset well patterns.
        </p>
      </div>

      {/* Category summary bar */}
      <div className="grid grid-cols-5 gap-3">
        {riskCategories.map((cat) => {
          const style = riskLevelStyles[cat.level];
          return (
            <div
              key={cat.id}
              className="rounded-md px-3 py-2.5 cursor-pointer transition-all"
              style={{
                backgroundColor: 'white',
                border: `1px solid #e2e8f0`,
                borderLeft: `3px solid ${style.dot}`,
              }}
            >
              <div className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>{cat.label}</div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {style.label}
                </span>
                <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                  {cat.count} matches
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Left: Risk signals */}
        <div className="space-y-3">
          {/* Primary risk detail */}
          <div
            className="rounded-md overflow-hidden"
            style={{ border: '2px solid #fde68a' }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: '#fffbeb' }}
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-sm font-bold" style={{ color: '#92400e' }}>
                  {selectedRisk.type} — Primary Risk Signal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#fde68a', color: '#92400e' }}
                >
                  {selectedRisk.level.toUpperCase()}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#fed7aa', color: '#7c2d12' }}
                >
                  {selectedRisk.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="px-4 py-4 bg-white space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Current Depth', value: `${selectedRisk.currentDepth.toLocaleString()} m` },
                  { label: 'Risk Interval', value: `${selectedRisk.depthZoneStart.toLocaleString()}–${selectedRisk.depthZoneEnd.toLocaleString()} m` },
                  { label: 'Historical Matches', value: `${selectedRisk.historicalMatches} wells` },
                  { label: 'Confidence', value: `${selectedRisk.confidence}%` },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs" style={{ color: '#94a3b8' }}>{item.label}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: '#0f1e3b' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <RiskTimeline
                currentDepth={selectedRisk.currentDepth}
                zoneStart={selectedRisk.depthZoneStart}
                zoneEnd={selectedRisk.depthZoneEnd}
              />
            </div>
          </div>

          {/* AI Risk Assessment */}
          <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: '#f1f5f9' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0f766e' }} />
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>AI Risk Assessment</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                {selectedRisk.description}
              </p>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#94a3b8' }}>
                  Why this risk was identified
                </div>
                <div className="space-y-1.5">
                  {[
                    `${selectedRisk.historicalMatches} nearby wells experienced ${selectedRisk.type.toLowerCase()} at similar depth`,
                    'Identical formation signature (XYZ Formation fracture network) detected',
                    `Current depth (${selectedRisk.currentDepth.toLocaleString()} m) within historical risk interval`,
                    'Current torque trend matches pre-event signature from OIL-XX-03',
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span style={{ color: '#d97706' }}>•</span>
                      <span style={{ color: '#374151' }}>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-3 rounded text-xs"
                style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e' }}
              >
                <div className="font-semibold mb-1">Risk grounded in historical evidence, not model prediction alone.</div>
                Confidence ({selectedRisk.confidence}%) is derived from depth+formation+parameter similarity across {selectedRisk.historicalMatches} offset wells with confirmed events.
              </div>
            </div>
          </div>

          {/* Recommended actions */}
          <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Recommended Actions</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: '⚠', priority: 'Immediate', text: 'Monitor mud pit return volumes closely for any loss trend.' },
                { icon: '◈', priority: 'Action', text: 'Review lost-circulation mitigation procedures for XYZ Formation.' },
                { icon: '◈', priority: 'Reference', text: 'Review offset well OIL-XX-03 — highest similarity (82%) at current depth.' },
                { icon: '◈', priority: 'Verify', text: 'Confirm formation transition zone via PWD and mud log comparison.' },
                { icon: '◈', priority: 'Prepare', text: 'Prepare LCM treatment — mica + calcium carbonate blend, 20+30 ppb ratio per OIL-XX-03 record.' },
              ].map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: '#d97706' }}>{action.icon}</span>
                  <div>
                    <span className="text-xs font-semibold mr-1.5" style={{ color: '#d97706' }}>
                      [{action.priority}]
                    </span>
                    <span className="text-sm" style={{ color: '#374151' }}>{action.text}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => onNavigate('knowledge-base')}
                className="w-full py-2 text-sm font-semibold rounded border transition-colors"
                style={{ borderColor: '#1d4ed8', color: '#1d4ed8', backgroundColor: 'transparent' }}
              >
                View Historical Mitigation Procedures
              </button>
            </div>
          </div>
        </div>

        {/* Right: Evidence panel */}
        <div className="space-y-3">
          <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Historical Evidence</span>
            </div>
            <div className="divide-y divide-slate-100">
              {relatedKB.map((kb) => (
                <div key={kb.id} className="px-3 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>{kb.wellId}</span>
                    <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{new Date(kb.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold" style={{ color: '#d97706' }}>
                      {kb.depth.toLocaleString()} m
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '10px' }}>
                      {kb.event}
                    </span>
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{kb.formation}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                    <strong>Cause:</strong> {kb.cause.slice(0, 80)}…
                  </p>
                  <p className="text-xs" style={{ color: '#0f766e' }}>
                    <strong>Mitigation:</strong> {kb.mitigation.slice(0, 60)}…
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Other active risks */}
          <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>All Risk Signals</span>
            </div>
            <div className="divide-y divide-slate-100">
              {riskSignals.map((rs) => {
                const style = riskLevelStyles[rs.level];
                const isSelected = rs.id === selectedRisk.id;
                return (
                  <button
                    key={rs.id}
                    onClick={() => setSelectedRisk(rs)}
                    className="w-full px-3 py-3 text-left"
                    style={{ backgroundColor: isSelected ? '#f8fafc' : 'white' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>{rs.type}</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {style.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#64748b' }}>
                      <span className="font-mono">Zone: {rs.depthZoneStart.toLocaleString()}–{rs.depthZoneEnd.toLocaleString()} m</span>
                      <span>{rs.confidence}% confidence</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: '#f1f5f9' }}>
                      <div
                        className="h-1 rounded-full"
                        style={{ width: `${rs.confidence}%`, backgroundColor: style.dot }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
