import { useState } from 'react';
import { wells, Well, depthComparison } from '../data/mockData';

interface WellIntelligenceProps {
  selectedWell: Well | null;
  onSelectWell: (well: Well) => void;
}

const eventColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  'mud-loss': { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', text: '#92400e' },
  'stuck-pipe': { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#991b1b' },
  'high-torque': { bg: '#fefce8', border: '#fef08a', dot: '#ca8a04', text: '#713f12' },
  'kick': { bg: '#fdf4ff', border: '#e9d5ff', dot: '#9333ea', text: '#6b21a8' },
  'overpressure': { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#991b1b' },
  'cementing-issue': { bg: '#eff6ff', border: '#bfdbfe', dot: '#2563eb', text: '#1e40af' },
  'npt': { bg: '#f5f3ff', border: '#ddd6fe', dot: '#7c3aed', text: '#5b21b6' },
  'normal': { bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', text: '#166534' },
};

const eventLabels: Record<string, string> = {
  'mud-loss': 'Mud Loss',
  'stuck-pipe': 'Stuck Pipe',
  'high-torque': 'High Torque',
  'kick': 'Kick',
  'overpressure': 'Overpressure',
  'cementing-issue': 'Cement Issue',
  'npt': 'NPT',
  'normal': 'Normal Drilling',
};

const tabs = ['Overview', 'Drilling Events', 'Depth Profile', 'Casing & Cement', 'Lessons Learned'];

function DepthChart() {
  const depths = depthComparison.depths;
  const wellColors: Record<string, string> = {
    'OIL-XX-01': '#dc2626',
    'OIL-XX-03': '#1d4ed8',
    'OIL-XX-07': '#0f766e',
    'OIL-XX-02': '#d97706',
  };
  const wellLabels = ['OIL-XX-01 (Active)', 'OIL-XX-03', 'OIL-XX-07', 'OIL-XX-02'];
  const param = 'torque';
  const allWellData = depthComparison.wells;

  const allValues = Object.values(allWellData)
    .flatMap((w) => w[param as keyof typeof w] as (number | null)[])
    .filter((v): v is number => v !== null);

  const minV = Math.min(...allValues);
  const maxV = Math.max(...allValues);
  const range = maxV - minV;

  const w = 500;
  const h = 180;
  const padLeft = 45;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 30;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const maxDepth = Math.max(...depths);
  const minDepth = Math.min(...depths);
  const depthRange = maxDepth - minDepth;

  const toX = (depth: number) => padLeft + ((depth - minDepth) / depthRange) * chartW;
  const toY = (val: number) => padTop + chartH - ((val - minV) / range) * chartH;

  const makePoints = (vals: (number | null)[]) => {
    const pts: string[] = [];
    vals.forEach((v, i) => {
      if (v !== null) pts.push(`${toX(depths[i])},${toY(v)}`);
    });
    return pts.join(' ');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-2 flex-wrap">
        {Object.entries(wellColors).map(([wellId, color]) => (
          <div key={wellId} className="flex items-center gap-1.5">
            <div className="w-4 h-1 rounded" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: '#64748b' }}>
              {wellId === 'OIL-XX-01' ? 'OIL-XX-01 (Active)' : wellId}
            </span>
          </div>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        {/* Risk zone */}
        <rect
          x={toX(3200)}
          y={padTop}
          width={toX(3350) - toX(3200)}
          height={chartH}
          fill="#d97706"
          opacity="0.08"
        />
        <line x1={toX(3200)} y1={padTop} x2={toX(3200)} y2={padTop + chartH}
          stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
        <line x1={toX(3350)} y1={padTop} x2={toX(3350)} y2={padTop + chartH}
          stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
        <text x={(toX(3200) + toX(3350)) / 2} y={padTop + 10} textAnchor="middle"
          fontSize="8" fill="#d97706" fontFamily="Inter, sans-serif" fontWeight="600">
          Historical Risk Zone
        </text>

        {/* Y axis */}
        {[minV, (minV + maxV) / 2, maxV].map((v) => (
          <g key={v}>
            <line x1={padLeft} y1={toY(v)} x2={padLeft + chartW} y2={toY(v)}
              stroke="#f1f5f9" strokeWidth="1" />
            <text x={padLeft - 4} y={toY(v) + 3} textAnchor="end" fontSize="7"
              fill="#94a3b8" fontFamily="JetBrains Mono, monospace">
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {depths.filter((_, i) => i % 2 === 0).map((d) => (
          <text key={d} x={toX(d)} y={h - 5} textAnchor="middle" fontSize="7"
            fill="#94a3b8" fontFamily="JetBrains Mono, monospace">
            {d.toLocaleString()}
          </text>
        ))}
        <text x={padLeft + chartW / 2} y={h} textAnchor="middle" fontSize="8"
          fill="#64748b" fontFamily="Inter, sans-serif">Depth (m)</text>
        <text x={padLeft - 30} y={padTop + chartH / 2} textAnchor="middle" fontSize="8"
          fill="#64748b" fontFamily="Inter, sans-serif"
          transform={`rotate(-90, ${padLeft - 30}, ${padTop + chartH / 2})`}>
          Torque (ft·lb)
        </text>

        {/* Lines */}
        {Object.entries(wellColors).map(([wellId, color]) => {
          const wellData = allWellData[wellId as keyof typeof allWellData];
          if (!wellData) return null;
          const vals = wellData[param as keyof typeof wellData] as (number | null)[];
          return (
            <polyline
              key={wellId}
              points={makePoints(vals)}
              fill="none"
              stroke={color}
              strokeWidth={wellId === 'OIL-XX-01' ? 2 : 1.5}
              strokeDasharray={wellId === 'OIL-XX-01' ? undefined : undefined}
              strokeLinejoin="round"
              opacity={0.9}
            />
          );
        })}

        {/* Current depth line */}
        <line x1={toX(3280)} y1={padTop} x2={toX(3280)} y2={padTop + chartH}
          stroke="#dc2626" strokeWidth="1.2" strokeDasharray="2 1.5" opacity="0.7" />
        <text x={toX(3280) + 3} y={padTop + 18} fontSize="7" fill="#dc2626"
          fontFamily="Inter, sans-serif" fontWeight="600">Current</text>
      </svg>
    </div>
  );
}

export default function WellIntelligence({ selectedWell, onSelectWell }: WellIntelligenceProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [wellPickerOpen, setWellPickerOpen] = useState(false);

  const displayWell = selectedWell || wells.find((w) => w.id === 'OIL-XX-03')!;
  const historicalWells = wells.filter((w) => w.type === 'historical');
  const significantEvents = displayWell.events.filter((e) => e.type !== 'normal');
  const nptHours = displayWell.events.reduce((sum, e) => sum + (e.duration || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>
            Well Intelligence — {displayWell.id}
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm" style={{ color: '#64748b' }}>{displayWell.location}</span>
            <span className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              Completed
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setWellPickerOpen(!wellPickerOpen)}
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded border"
            style={{ borderColor: '#e2e8f0', backgroundColor: 'white', color: '#374151' }}
          >
            <span>Switch Well</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {wellPickerOpen && (
            <div
              className="absolute right-0 top-full mt-1 rounded-md shadow-lg z-20 w-48 overflow-hidden"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            >
              {historicalWells.map((w) => (
                <button
                  key={w.id}
                  onClick={() => { onSelectWell(w); setWellPickerOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                  style={{ color: '#374151' }}
                >
                  <span>{w.id}</span>
                  <span className="text-xs font-medium" style={{ color: '#16a34a' }}>{w.similarity}%</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Well summary row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Depth', value: `${displayWell.depth.toLocaleString()} m`, mono: true },
          { label: 'Formation', value: displayWell.formation, mono: false },
          { label: 'Drilling Period', value: displayWell.drillingPeriod || 'N/A', mono: false },
          { label: 'NPT Total', value: `${nptHours} hrs`, mono: true, alert: nptHours > 40 },
          { label: 'Similarity to Active', value: `${displayWell.similarity}%`, mono: true, good: true },
        ].map((item) => (
          <div key={item.label} className="rounded-md px-3 py-2.5"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="text-xs mb-1" style={{ color: '#94a3b8' }}>{item.label}</div>
            <div
              className={`text-sm font-bold ${item.mono ? 'font-mono' : ''}`}
              style={{ color: item.alert ? '#dc2626' : item.good ? '#16a34a' : '#0f1e3b' }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-0" style={{ borderColor: '#e2e8f0' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeTab === tab ? '#1d4ed8' : 'transparent',
              color: activeTab === tab ? '#1d4ed8' : '#64748b',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
                <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Drilling Summary</span>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  { label: 'Major Drilling Events', value: `${significantEvents.length} events` },
                  { label: 'Mud Losses', value: `${displayWell.events.filter(e => e.type === 'mud-loss').length} incidents` },
                  { label: 'Stuck Pipe Incidents', value: `${displayWell.events.filter(e => e.type === 'stuck-pipe').length} incidents` },
                  { label: 'Casing Strings', value: `${displayWell.casings?.length || 0} strings` },
                  { label: 'Total NPT', value: `${nptHours} hours` },
                  { label: 'Mud Weight Range', value: `${(displayWell.mudWeight || 10).toFixed(1)}–${((displayWell.mudWeight || 10) + 1.2).toFixed(1)} ppg` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#374151' }}>{row.label}</span>
                    <span className="text-sm font-semibold font-mono" style={{ color: '#0f1e3b' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
                <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Formations Encountered</span>
              </div>
              <div className="p-4 space-y-2">
                {['Alluvium (0–180m)', 'ABC Shale (180–900m)', 'Sandstone Zone (900–2,400m)', `${displayWell.formation} (2,900m+)`].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1 h-5 rounded" style={{
                      backgroundColor: ['#e2e8f0', '#e0e7ff', '#fef3c7', '#bfdbfe'][i]
                    }} />
                    <span className="text-sm" style={{ color: '#374151' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
                <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Key Events</span>
              </div>
              <div className="divide-y divide-slate-100">
                {displayWell.events.map((ev) => {
                  const style = eventColors[ev.type] || eventColors.normal;
                  return (
                    <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: style.dot }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold" style={{ color: '#0f1e3b' }}>
                            {ev.depth.toLocaleString()} m
                          </span>
                          <span className="text-xs font-medium" style={{ color: style.dot }}>
                            {eventLabels[ev.type]}
                          </span>
                          {ev.duration && (
                            <span className="text-xs" style={{ color: '#94a3b8' }}>{ev.duration}h NPT</span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{ev.description}</p>
                        {ev.mitigation && (
                          <p className="text-xs mt-0.5 italic" style={{ color: '#0f766e' }}>
                            ↳ {ev.mitigation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Drilling Events' && (
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
              Depth-based Event Timeline
            </span>
          </div>
          <div className="p-6">
            <div className="relative pl-8">
              {/* Depth line */}
              <div
                className="absolute left-4 top-0 bottom-0 w-0.5"
                style={{ backgroundColor: '#e2e8f0' }}
              />
              {displayWell.events.map((ev, i) => {
                const style = eventColors[ev.type] || eventColors.normal;
                return (
                  <div key={ev.id} className="relative mb-6 last:mb-0">
                    <div
                      className="absolute -left-6 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: style.dot, top: '4px' }}
                    />
                    <div
                      className="rounded-md px-4 py-3"
                      style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm" style={{ color: style.dot }}>
                              {ev.depth.toLocaleString()} m
                            </span>
                            <span className="font-semibold text-sm" style={{ color: style.text }}>
                              {eventLabels[ev.type]}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: style.text }}>{ev.description}</p>
                          {ev.mitigation && (
                            <p className="text-sm mt-1.5 font-medium" style={{ color: '#0f766e' }}>
                              Mitigation: {ev.mitigation}
                            </p>
                          )}
                        </div>
                        {ev.duration && (
                          <div className="flex-shrink-0 text-right">
                            <div className="text-xs" style={{ color: '#94a3b8' }}>NPT</div>
                            <div className="text-sm font-bold font-mono" style={{ color: '#dc2626' }}>
                              {ev.duration}h
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Depth Profile' && (
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
              Depth-wise Offset Comparison — Torque
            </span>
            <div
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
            >
              Risk zone: 3,200–3,350 m
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm mb-4" style={{ color: '#64748b' }}>
              Comparing active well OIL-XX-01 against 3 historical offset wells. The shaded zone indicates the historically documented mud-loss interval where all 4 wells show elevated torque followed by a characteristic drop — a precursor signature.
            </p>
            <DepthChart />
            <div
              className="mt-4 px-3 py-2.5 rounded text-sm"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
            >
              <strong>Observation:</strong> OIL-XX-01's current torque trend closely matches OIL-XX-03's pre-mud-loss signature at 3,245 m. OIL-XX-03 experienced 24 hrs NPT at this interval.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Casing & Cement' && (
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-4 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Casing & Cementing Record</span>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['String', 'Size', 'Set Depth', 'Cement Top', 'Status'].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-xs font-semibold" style={{ color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayWell.casings?.map((c) => (
                  <tr key={c.type} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: '#1e293b' }}>{c.type}</td>
                    <td className="py-2.5 pr-4 font-mono" style={{ color: '#374151' }}>{c.size}</td>
                    <td className="py-2.5 pr-4 font-mono" style={{ color: '#374151' }}>{c.depth.toLocaleString()} m</td>
                    <td className="py-2.5 pr-4 font-mono" style={{ color: '#374151' }}>Surface</td>
                    <td className="py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        Cemented
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Lessons Learned' && (
        <div className="space-y-3">
          {significantEvents.map((ev) => {
            const style = eventColors[ev.type] || eventColors.normal;
            return (
              <div key={ev.id} className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: '#f1f5f9' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
                  <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                    {eventLabels[ev.type]} at {ev.depth.toLocaleString()} m
                  </span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#94a3b8' }}>What Happened</div>
                    <p className="text-sm" style={{ color: '#374151' }}>{ev.description}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#94a3b8' }}>Mitigation Applied</div>
                    <p className="text-sm" style={{ color: '#374151' }}>{ev.mitigation || 'No mitigation recorded'}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#94a3b8' }}>NPT Impact</div>
                    <p className="text-sm font-mono font-bold" style={{ color: ev.duration ? '#dc2626' : '#16a34a' }}>
                      {ev.duration ? `${ev.duration} hours` : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
