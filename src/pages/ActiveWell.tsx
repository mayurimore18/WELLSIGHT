import { useState, useEffect } from 'react';
import { liveData, realtimeTrend } from '../data/mockData';

function MiniChart({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts.join(' ')} ${width},${height}`}
        fill={`url(#g-${color.replace('#', '')})`}
      />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r="2"
        fill={color}
      />
    </svg>
  );
}

const paramDefs = [
  { key: 'depth' as keyof typeof liveData, label: 'Bit Depth', unit: 'm', color: '#1d4ed8', trend: realtimeTrend.depth, format: (v: number) => v.toLocaleString() },
  { key: 'rop' as keyof typeof liveData, label: 'ROP', unit: 'm/hr', color: '#0f766e', trend: realtimeTrend.rop, format: (v: number) => v.toFixed(1) },
  { key: 'wob' as keyof typeof liveData, label: 'WOB', unit: 'klbs', color: '#7c3aed', trend: [22.1, 22.8, 23.5, 24.0, 24.2, 24.5, 24.6, 24.6], format: (v: number) => v.toFixed(1) },
  { key: 'rpm' as keyof typeof liveData, label: 'RPM', unit: 'rpm', color: '#0891b2', trend: [108, 110, 109, 111, 110, 110, 110, 110], format: (v: number) => v.toString() },
  { key: 'torque' as keyof typeof liveData, label: 'Torque', unit: 'ft·lb', color: '#d97706', trend: realtimeTrend.torque, format: (v: number) => v.toLocaleString() },
  { key: 'mudFlow' as keyof typeof liveData, label: 'Flow Rate', unit: 'gpm', color: '#059669', trend: realtimeTrend.rop.map(() => 878 + Math.random() * 4), format: (v: number) => v.toString() },
  { key: 'standpipePressure' as keyof typeof liveData, label: 'SPP', unit: 'psi', color: '#dc2626', trend: realtimeTrend.pressure, format: (v: number) => v.toLocaleString() },
  { key: 'temperature' as keyof typeof liveData, label: 'Temperature', unit: '°C', color: '#ea580c', trend: [118, 119, 120, 121, 122, 123, 123, 124], format: (v: number) => v.toString() },
];

export default function ActiveWell() {
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState('10:24:18');
  const [liveVals, setLiveVals] = useState({ ...liveData });

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
      setLiveVals((prev) => ({
        ...prev,
        depth: prev.depth + (Math.random() > 0.7 ? 0.1 : 0),
        rop: +(prev.rop + (Math.random() - 0.5) * 0.3).toFixed(1),
        torque: Math.round(prev.torque + (Math.random() - 0.4) * 80),
        standpipePressure: Math.round(prev.standpipePressure + (Math.random() - 0.5) * 15),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>
            Active Well — OIL-XX-01
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Real-time eRTMAC parameter monitoring · Upper Assam Block, Field A
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border"
            style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#16a34a' }} />
            <span className="font-semibold" style={{ color: '#16a34a' }}>LIVE</span>
          </div>
          <div className="text-xs font-mono" style={{ color: '#64748b' }}>
            Last sync: {time}
          </div>
        </div>
      </div>

      {/* Demo notice */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded text-xs"
        style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Demonstration data — simulated real-time values for illustration purposes. Not connected to actual eRTMAC system.</span>
      </div>

      {/* Well status bar */}
      <div
        className="rounded-md px-4 py-3 grid grid-cols-6 gap-4"
        style={{ backgroundColor: '#0f1e3b' }}
      >
        {[
          { label: 'Well ID', value: 'OIL-XX-01', sub: null },
          { label: 'Status', value: 'DRILLING', sub: null, color: '#4ade80' },
          { label: 'Current Depth', value: `${liveVals.depth.toFixed(0)} m`, sub: 'Bit depth' },
          { label: 'Formation', value: 'XYZ Formation', sub: 'Top at 2,900 m' },
          { label: 'Mud Weight', value: `${liveVals.mudWeight} ppg`, sub: 'WBM' },
          { label: 'Gas Units', value: `${liveVals.gasUnits} gu`, sub: null, color: '#fde68a' },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-xs" style={{ color: '#64748b' }}>{item.label}</div>
            <div
              className="text-sm font-bold font-mono mt-0.5"
              style={{ color: item.color || 'white' }}
            >
              {item.value}
            </div>
            {item.sub && <div className="text-xs" style={{ color: '#475569' }}>{item.sub}</div>}
          </div>
        ))}
      </div>

      {/* Live params grid */}
      <div className="grid grid-cols-4 gap-3">
        {paramDefs.map((p) => {
          const val = liveVals[p.key];
          const displayVal = typeof val === 'number' ? p.format(val) : String(val);
          const isTorque = p.key === 'torque';
          const isSPP = p.key === 'standpipePressure';
          const hasAlert = (isTorque && (liveVals.torque > 14500)) || false;

          return (
            <div
              key={p.key}
              className="rounded-md px-3 py-3"
              style={{
                backgroundColor: 'white',
                border: hasAlert ? `1px solid #fca5a5` : '1px solid #e2e8f0',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: '#64748b' }}>
                  {p.label}
                </span>
                {hasAlert && (
                  <span className="text-xs font-bold" style={{ color: '#dc2626' }}>↑</span>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="text-xl font-bold font-mono leading-none"
                    style={{ color: p.color, letterSpacing: '-0.02em' }}
                  >
                    {displayVal}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{p.unit}</div>
                </div>
                <MiniChart data={p.trend} color={p.color} height={36} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom sections: Casing + Formation + AI monitoring */}
      <div className="grid grid-cols-3 gap-3">
        {/* Casing program */}
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Casing Program</span>
          </div>
          <div className="p-3 space-y-2">
            {[
              { type: 'Conductor', depth: '80 m', size: '30"', status: 'set' },
              { type: 'Surface', depth: '600 m', size: '18-5/8"', status: 'set' },
              { type: 'Intermediate', depth: '2,800 m', size: '13-3/8"', status: 'set' },
              { type: 'Production', depth: '~4,200 m', size: '9-5/8"', status: 'planned' },
            ].map((c) => (
              <div key={c.type} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.status === 'set' ? '#16a34a' : '#94a3b8' }}
                />
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: '#1e293b' }}>{c.type}</div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>{c.depth} · {c.size}</div>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: c.status === 'set' ? '#f0fdf4' : '#f1f5f9',
                    color: c.status === 'set' ? '#16a34a' : '#64748b',
                    fontSize: '10px',
                  }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Formation column */}
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Formations Encountered</span>
          </div>
          <div className="p-3 space-y-2">
            {[
              { name: 'Alluvium', depth: '0–180 m', color: '#e2e8f0' },
              { name: 'ABC Shale', depth: '180–900 m', color: '#e0e7ff' },
              { name: 'Sandstone Zone', depth: '900–2,400 m', color: '#fef3c7' },
              { name: 'ABC Formation', depth: '2,400–2,900 m', color: '#d1fae5' },
              { name: 'XYZ Formation ★', depth: '2,900–3,280 m+', color: '#bfdbfe' },
            ].map((f) => (
              <div key={f.name} className="flex items-center gap-2.5">
                <div className="w-3 h-4 rounded flex-shrink-0" style={{ backgroundColor: f.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: '#1e293b' }}>{f.name}</div>
                  <div className="text-xs font-mono" style={{ color: '#94a3b8' }}>{f.depth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI monitoring status */}
        <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>AI Monitoring Status</span>
          </div>
          <div className="p-3 space-y-3">
            {[
              { label: 'Pattern Matching', status: 'Active', color: '#16a34a' },
              { label: 'Risk Zone Detection', status: 'Active', color: '#16a34a' },
              { label: 'Offset Well Comparison', status: 'Active', color: '#16a34a' },
              { label: 'Document Intelligence', status: 'Ready', color: '#0f766e' },
              { label: 'Alert Engine', status: 'Active', color: '#16a34a' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#374151' }}>{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium" style={{ color: item.color }}>{item.status}</span>
                </div>
              </div>
            ))}
            <div
              className="mt-2 p-2.5 rounded text-xs leading-relaxed"
              style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e' }}
            >
              Current depth (3,280 m) is within a historically documented mud-loss interval. Enhanced monitoring active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
