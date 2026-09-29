import { useState } from 'react';
import { alerts, Alert } from '../data/mockData';

interface AlertsProps {
  onNavigate: (page: string) => void;
}

export default function Alerts({ onNavigate }: AlertsProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'resolved'>('all');
  const [alertList, setAlertList] = useState<Alert[]>(alerts);

  const filtered = alertList.filter((a) => {
    if (filter === 'resolved') return a.resolved;
    if (filter === 'all') return !a.resolved;
    return !a.resolved && a.type === filter;
  });

  const resolve = (id: string) => {
    setAlertList((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
  };

  const typeStyles = {
    critical: { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#991b1b', label: 'CRITICAL', icon: '🔴' },
    warning: { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', text: '#92400e', label: 'WARNING', icon: '⚠' },
    info: { bg: '#eff6ff', border: '#bfdbfe', dot: '#2563eb', text: '#1e40af', label: 'INFO', icon: 'ℹ' },
  };

  const activeCount = alertList.filter((a) => !a.resolved);
  const criticalCount = activeCount.filter((a) => a.type === 'critical').length;
  const warningCount = activeCount.filter((a) => a.type === 'warning').length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>Drilling Alerts</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            AI-generated alerts from pattern matching and risk zone analysis.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#dc2626' }} />
              <span className="font-bold" style={{ color: '#dc2626' }}>{criticalCount} Critical</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d97706' }} />
              <span className="font-bold" style={{ color: '#d97706' }}>{warningCount} Warning</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'critical', 'warning', 'info', 'resolved'] as const).map((f) => {
          const counts = {
            all: alertList.filter((a) => !a.resolved).length,
            critical: alertList.filter((a) => !a.resolved && a.type === 'critical').length,
            warning: alertList.filter((a) => !a.resolved && a.type === 'warning').length,
            info: alertList.filter((a) => !a.resolved && a.type === 'info').length,
            resolved: alertList.filter((a) => a.resolved).length,
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{
                backgroundColor: filter === f ? '#1d4ed8' : 'white',
                color: filter === f ? 'white' : '#374151',
                border: filter === f ? 'none' : '1px solid #e2e8f0',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {counts[f] > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: filter === f ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: filter === f ? 'white' : '#64748b',
                  }}
                >
                  {counts[f]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-12 rounded-md"
          style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }}
        >
          <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <p className="text-sm">No {filter !== 'all' ? filter : 'active'} alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const style = typeStyles[alert.type] || typeStyles.info;
            return (
              <div
                key={alert.id}
                className="rounded-md overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${alert.resolved ? '#e2e8f0' : style.border}`,
                  opacity: alert.resolved ? 0.7 : 1,
                }}
              >
                <div
                  className="px-4 py-2.5 flex items-center justify-between"
                  style={{
                    backgroundColor: alert.resolved ? '#f8fafc' : style.bg,
                    borderBottom: `1px solid ${alert.resolved ? '#f1f5f9' : style.border}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: style.dot }} />
                    <span className="text-xs font-bold tracking-wide" style={{ color: style.text }}>
                      {style.label}
                    </span>
                    {alert.resolved && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        Resolved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: '#64748b' }}>{alert.time}</span>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolve(alert.id)}
                        className="text-xs font-medium px-2 py-0.5 rounded border transition-colors"
                        style={{ borderColor: '#e2e8f0', color: '#64748b' }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-semibold mb-1" style={{ color: '#0f1e3b' }}>
                    {alert.title}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {alert.description}
                  </p>
                  {(alert.depth || alert.wellId) && (
                    <div className="flex items-center gap-3 mt-2">
                      {alert.depth && (
                        <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                          Depth: {alert.depth.toLocaleString()} m
                        </span>
                      )}
                      {alert.wellId && (
                        <span className="text-xs" style={{ color: '#94a3b8' }}>
                          Well: {alert.wellId}
                        </span>
                      )}
                    </div>
                  )}
                  {!alert.resolved && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onNavigate('risk-monitor')}
                        className="text-xs font-medium px-2.5 py-1.5 rounded text-white"
                        style={{ backgroundColor: style.dot }}
                      >
                        View Risk Analysis
                      </button>
                      <button
                        onClick={() => onNavigate('well-intelligence')}
                        className="text-xs font-medium px-2.5 py-1.5 rounded border"
                        style={{ borderColor: '#e2e8f0', color: '#374151' }}
                      >
                        View Well Intelligence
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
