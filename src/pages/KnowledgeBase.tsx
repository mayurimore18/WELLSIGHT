import { useState } from 'react';
import { knowledgeBaseEntries, documents } from '../data/mockData';

const severityColors = {
  low: { bg: '#f0fdf4', text: '#16a34a' },
  medium: { bg: '#fffbeb', text: '#d97706' },
  high: { bg: '#fef2f2', text: '#dc2626' },
  critical: { bg: '#fef2f2', text: '#7f1d1d' },
};

const docTypeLabels: Record<string, string> = {
  WCR: 'Well Completion Report',
  DDR: 'Daily Drilling Report',
  MLR: 'Mud Logging Report',
  CR: 'Cementing Report',
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [formationFilter, setFormationFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'knowledge' | 'documents'>('knowledge');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [exportState, setExportState] = useState<string | null>(null);

  const filteredEntries = knowledgeBaseEntries.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.wellId.toLowerCase().includes(q) ||
      e.event.toLowerCase().includes(q) ||
      e.formation.toLowerCase().includes(q) ||
      e.cause.toLowerCase().includes(q) ||
      e.mitigation.toLowerCase().includes(q) ||
      e.depth.toString().includes(q);
    const matchesFormation = formationFilter === 'all' || e.formation.includes(formationFilter);
    const matchesEvent = eventFilter === 'all' || e.event.toLowerCase().includes(eventFilter.toLowerCase());
    return matchesSearch && matchesFormation && matchesEvent;
  });

  const handleExport = (format: string) => {
    setExportState(format);
    setTimeout(() => setExportState(null), 2000);
  };

  const selectedDocData = documents.find((d) => d.id === selectedDoc);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>Drilling Knowledge Base</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          Searchable repository of historical drilling events, formations, and mitigation procedures.
        </p>
      </div>

      {/* Tab switch */}
      <div className="flex items-center gap-2">
        {(['knowledge', 'documents'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: activeTab === tab ? '#1d4ed8' : 'white',
              color: activeTab === tab ? 'white' : '#374151',
              border: activeTab === tab ? 'none' : '1px solid #e2e8f0',
            }}
          >
            {tab === 'knowledge' ? 'Event Knowledge Base' : 'Document Intelligence'}
          </button>
        ))}
      </div>

      {activeTab === 'knowledge' && (
        <>
          {/* Search + filters */}
          <div
            className="rounded-md px-4 py-3 space-y-3"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drilling events, formations, depths, wells… e.g. 'mud loss at 3200'"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded border outline-none"
                style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#64748b' }}>Formation:</span>
                <select
                  value={formationFilter}
                  onChange={(e) => setFormationFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded border outline-none"
                  style={{ borderColor: '#e2e8f0', color: '#374151' }}
                >
                  <option value="all">All</option>
                  <option value="XYZ">XYZ Formation</option>
                  <option value="ABC">ABC Formation</option>
                  <option value="Sandstone">Sandstone</option>
                  <option value="Shale">Shale</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#64748b' }}>Event:</span>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded border outline-none"
                  style={{ borderColor: '#e2e8f0', color: '#374151' }}
                >
                  <option value="all">All Events</option>
                  <option value="mud loss">Mud Loss</option>
                  <option value="stuck">Stuck Pipe</option>
                  <option value="overp">Overpressure</option>
                </select>
              </div>
              <div className="ml-auto text-xs" style={{ color: '#64748b' }}>
                <span className="font-semibold" style={{ color: '#0f1e3b' }}>{filteredEntries.length}</span> records found
              </div>
            </div>
          </div>

          {/* Results */}
          {searchQuery && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2 rounded"
              style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Showing {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}

          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <div
                className="text-center py-10 rounded-md"
                style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }}
              >
                <p className="text-sm">No records match your search criteria.</p>
                <button
                  onClick={() => { setSearchQuery(''); setFormationFilter('all'); setEventFilter('all'); }}
                  className="mt-2 text-xs font-medium"
                  style={{ color: '#1d4ed8' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const sev = severityColors[entry.severity] || severityColors.medium;
                return (
                  <div
                    key={entry.id}
                    className="rounded-md overflow-hidden"
                    style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                  >
                    <div
                      className="px-4 py-2.5 border-b flex items-center justify-between"
                      style={{ borderColor: '#f1f5f9', backgroundColor: '#f8fafc' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: '#0f1e3b' }}>{entry.wellId}</span>
                        <span className="text-sm font-mono" style={{ color: '#64748b' }}>
                          {entry.depth.toLocaleString()} m
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          {entry.event}
                        </span>
                        <span className="text-xs" style={{ color: '#94a3b8' }}>{entry.formation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: sev.bg, color: sev.text }}
                        >
                          {entry.severity.toUpperCase()}
                        </span>
                        <span className="text-xs" style={{ color: '#94a3b8' }}>
                          {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-4 grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#94a3b8' }}>
                          What Happened
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{entry.cause}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#94a3b8' }}>
                          Mitigation Applied
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{entry.mitigation}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#94a3b8' }}>
                          Outcome
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{entry.outcome}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {activeTab === 'documents' && (
        <div className="grid gap-4" style={{ gridTemplateColumns: selectedDoc ? '1fr 420px' : '1fr' }}>
          {/* Document list */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-md"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                Uploaded Historical Documents
              </span>
              <div className="flex items-center gap-2">
                {exportState ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                    ✓ {exportState} exported
                  </span>
                ) : (
                  <>
                    <button onClick={() => handleExport('CSV')} className="text-xs font-medium px-2.5 py-1 rounded border" style={{ borderColor: '#e2e8f0', color: '#374151' }}>
                      Export CSV
                    </button>
                    <button onClick={() => handleExport('PDF')} className="text-xs font-medium px-2.5 py-1 rounded text-white" style={{ backgroundColor: '#1d4ed8' }}>
                      Export PDF
                    </button>
                  </>
                )}
              </div>
            </div>

            <div
              className="rounded-md overflow-hidden"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Document', 'Type', 'Well', 'Date', 'Status', 'Events', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b hover:bg-slate-50 cursor-pointer"
                      style={{ borderColor: '#f1f5f9' }}
                      onClick={() => setSelectedDoc(doc.id === selectedDoc ? null : doc.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="text-sm font-medium" style={{ color: '#1e293b' }}>{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: '#374151' }}>{doc.wellId}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>
                        {new Date(doc.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                          ✓ Processed
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: '#374151' }}>{doc.extractedEvents}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-medium" style={{ color: '#1d4ed8' }}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document extraction view */}
          {selectedDocData && (
            <div className="space-y-3">
              <div className="rounded-md" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
                <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
                  <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
                    AI Extracted Intelligence
                  </span>
                  <button onClick={() => setSelectedDoc(null)} className="text-xs" style={{ color: '#94a3b8' }}>✕</button>
                </div>
                <div className="p-4 space-y-3">
                  {/* Processing status */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#94a3b8' }}>
                      Processing Status
                    </div>
                    {[
                      { label: 'OCR Processed', done: true },
                      { label: 'Key Events Extracted', done: true },
                      { label: 'Depth References Identified', done: true },
                      { label: 'Formation Identified', done: true },
                      { label: 'Added to Knowledge Base', done: true },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-2 py-1">
                        <span className="text-xs" style={{ color: s.done ? '#16a34a' : '#94a3b8' }}>
                          {s.done ? '✓' : '○'}
                        </span>
                        <span className="text-xs" style={{ color: s.done ? '#374151' : '#94a3b8' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Extracted data */}
                  <div className="border-t pt-3" style={{ borderColor: '#f1f5f9' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#94a3b8' }}>
                      Extracted Information
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Well', value: selectedDocData.wellId },
                        { label: 'Document Type', value: docTypeLabels[selectedDocData.type] },
                        { label: 'Key Depth', value: '3,245 m' },
                        { label: 'Formation', value: 'XYZ Formation' },
                        { label: 'Primary Event', value: 'Mud Loss' },
                        { label: 'Severity', value: 'High' },
                        { label: 'Mitigation', value: 'LCM + reduced ECD' },
                        { label: 'NPT Duration', value: '24 hours' },
                        { label: 'Events Extracted', value: `${selectedDocData.extractedEvents} events` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span style={{ color: '#64748b' }}>{row.label}</span>
                          <span className="font-medium" style={{ color: '#1e293b' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="px-3 py-2.5 rounded text-xs leading-relaxed"
                    style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e' }}
                  >
                    Unstructured PDF text converted to structured knowledge. This record is now searchable and contributes to risk analysis for nearby active wells.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
