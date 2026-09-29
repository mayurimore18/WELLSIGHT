import { useState } from 'react';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

const reportTypes = [
  {
    id: 'nearby-summary',
    title: 'Nearby Well Summary',
    description: 'Overview of all historical wells within selected radius with similarity scores.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="10" r="4" />
        <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" />
      </svg>
    ),
  },
  {
    id: 'risk-report',
    title: 'Drilling Risk Report',
    description: 'Current risk signals, confidence levels, historical evidence, and mitigation recommendations.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'historical-event',
    title: 'Historical Event Report',
    description: 'Detailed record of all historical drilling events from offset wells in the knowledge base.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'depth-comparison',
    title: 'Depth-wise Comparison',
    description: 'Parameter comparison (torque, ROP, pressure) across active and offset wells vs. depth.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'well-intelligence',
    title: 'Well Intelligence Report',
    description: 'Comprehensive single-well analysis: events, formations, casings, and lessons learned.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
];

export default function Reports({ onNavigate }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState('risk-report');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [exportState, setExportState] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  const handleExport = (format: string) => {
    setExportState(format);
    setTimeout(() => setExportState(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          Generate and export drilling intelligence reports for review and documentation.
        </p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
        {/* Report type selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide px-1" style={{ color: '#94a3b8' }}>
            Report Types
          </div>
          {reportTypes.map((r) => (
            <button
              key={r.id}
              onClick={() => { setSelectedReport(r.id); setGenerated(false); }}
              className="w-full flex items-start gap-3 px-3 py-3 rounded-md text-left transition-colors"
              style={{
                backgroundColor: selectedReport === r.id ? '#eff6ff' : 'white',
                border: selectedReport === r.id ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              }}
            >
              <span style={{ color: selectedReport === r.id ? '#1d4ed8' : '#94a3b8', flexShrink: 0 }}>
                {r.icon}
              </span>
              <div>
                <div className="text-sm font-semibold" style={{ color: selectedReport === r.id ? '#1d4ed8' : '#0f1e3b' }}>
                  {r.title}
                </div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#64748b' }}>
                  {r.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Report preview / generation */}
        <div className="space-y-3">
          {/* Configuration */}
          <div className="rounded-md px-4 py-3" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
            <div className="text-sm font-semibold mb-3" style={{ color: '#0f1e3b' }}>Report Configuration</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Active Well</label>
                <select className="w-full text-xs px-2.5 py-1.5 rounded border outline-none" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                  <option>OIL-XX-01</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Radius</label>
                <select className="w-full text-xs px-2.5 py-1.5 rounded border outline-none" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                  <option>10 km</option>
                  <option>5 km</option>
                  <option>20 km</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>Date Range</label>
                <select className="w-full text-xs px-2.5 py-1.5 rounded border outline-none" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                  <option>Last 5 years</option>
                  <option>Last 3 years</option>
                  <option>All time</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 text-sm font-semibold rounded text-white transition-colors"
                style={{ backgroundColor: generating ? '#93c5fd' : '#1d4ed8' }}
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="15 50" />
                    </svg>
                    Generating…
                  </span>
                ) : 'Generate Report'}
              </button>
              {generated && (
                <>
                  {exportState ? (
                    <span className="text-xs font-medium px-2.5 py-1.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                      ✓ {exportState} downloaded
                    </span>
                  ) : (
                    <>
                      <button onClick={() => handleExport('PDF')} className="px-3 py-2 text-sm font-medium rounded border" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                        Export PDF
                      </button>
                      <button onClick={() => handleExport('CSV')} className="px-3 py-2 text-sm font-medium rounded border" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                        Export CSV
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          {generated && (
            <div
              className="rounded-md overflow-hidden"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            >
              {/* Report header */}
              <div
                className="px-6 py-4 border-b"
                style={{ backgroundColor: '#0f1e3b', borderColor: '#1a3260' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#38bdf8' }}>
                      Oil India Limited · eRTMAC-NWIS
                    </div>
                    <div className="text-lg font-bold text-white">
                      {reportTypes.find((r) => r.id === selectedReport)?.title}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: '#64748b' }}>Generated</div>
                    <div className="text-sm font-mono text-white">29 Sep 2026 · 10:25</div>
                    <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>Demonstration Data</div>
                  </div>
                </div>
              </div>

              {/* Report body */}
              <div className="p-6 space-y-5">
                {/* Summary section */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#94a3b8' }}>
                    Executive Summary
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Active Well', value: 'OIL-XX-01', sub: 'Drilling · 3,280 m' },
                      { label: 'Nearby Wells', value: '12', sub: 'within 10 km' },
                      { label: 'Risk Events', value: '27', sub: 'historical matches' },
                      { label: 'Current Risk', value: 'MEDIUM', sub: 'Mud Loss', color: '#d97706' },
                    ].map((item) => (
                      <div key={item.label} className="rounded px-3 py-2.5" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <div className="text-xs" style={{ color: '#94a3b8' }}>{item.label}</div>
                        <div className="text-lg font-bold font-mono" style={{ color: item.color || '#0f1e3b' }}>{item.value}</div>
                        <div className="text-xs" style={{ color: '#64748b' }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key findings */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#94a3b8' }}>
                    Key Findings
                  </div>
                  <div className="space-y-2">
                    {[
                      { level: 'HIGH', text: 'Current depth (3,280 m) falls within historically documented mud-loss interval (3,200–3,350 m).', color: '#d97706' },
                      { level: 'NOTE', text: '4 offset wells (OIL-XX-02, -03, -07, -05) recorded mud loss at similar depth in XYZ Formation.', color: '#1d4ed8' },
                      { level: 'NOTE', text: 'Torque trend matches OIL-XX-03 pre-event signature with 82% confidence.', color: '#1d4ed8' },
                      { level: 'INFO', text: 'Stuck pipe risk zone (3,700–3,850 m) is 420 m ahead. Monitor drag as leading indicator.', color: '#0f766e' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="font-bold text-xs mt-0.5 flex-shrink-0" style={{ color: item.color }}>
                          [{item.level}]
                        </span>
                        <span style={{ color: '#374151' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended action */}
                <div
                  className="px-4 py-3 rounded"
                  style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#92400e' }}>
                    Key Recommendation
                  </div>
                  <p className="text-sm" style={{ color: '#92400e' }}>
                    Review mud-loss mitigation procedures for XYZ Formation before drilling beyond 3,280 m.
                    Prepare LCM treatment (mica + CaCO₃ blend). Reference OIL-XX-03 Well Completion Report for exact volumes and method.
                  </p>
                </div>

                <div className="text-xs text-center" style={{ color: '#94a3b8' }}>
                  This report is generated from demonstration data and is intended for illustration only. Not for operational use.
                </div>
              </div>
            </div>
          )}

          {!generated && !generating && (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-md text-center"
              style={{ backgroundColor: 'white', border: '1px dashed #e2e8f0' }}
            >
              <svg className="mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Configure and generate a report</p>
              <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>Select report type and parameters above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
