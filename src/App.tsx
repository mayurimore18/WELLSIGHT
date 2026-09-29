import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import Overview from './pages/Overview';
import NearbyWells from './pages/NearbyWells';
import ActiveWell from './pages/ActiveWell';
import WellIntelligence from './pages/WellIntelligence';
import RiskMonitor from './pages/RiskMonitor';
import KnowledgeBase from './pages/KnowledgeBase';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import { Well, alerts } from './data/mockData';

type Page =
  | 'overview'
  | 'nearby-wells'
  | 'active-well'
  | 'well-intelligence'
  | 'risk-monitor'
  | 'knowledge-base'
  | 'reports'
  | 'alerts';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeAlertCount = alerts.filter((a) => !a.resolved && a.type !== 'info').length;
  const unreadNotifications = alerts.filter((a) => !a.resolved).slice(0, 3);

  const navigate = (page: string) => setCurrentPage(page as Page);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview onNavigate={navigate} onSelectWell={setSelectedWell} />;
      case 'nearby-wells':
        return <NearbyWells onNavigate={navigate} onSelectWell={setSelectedWell} />;
      case 'active-well':
        return <ActiveWell />;
      case 'well-intelligence':
        return <WellIntelligence selectedWell={selectedWell} onSelectWell={setSelectedWell} />;
      case 'risk-monitor':
        return <RiskMonitor onNavigate={navigate} />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'reports':
        return <Reports onNavigate={navigate} />;
      case 'alerts':
        return <Alerts onNavigate={navigate} />;
      default:
        return <Overview onNavigate={navigate} onSelectWell={setSelectedWell} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        alertCount={activeAlertCount}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '220px' }}>
        {/* Top header */}
        <header
          className="fixed top-0 right-0 z-20 flex items-center justify-between px-5 py-0"
          style={{
            left: '220px',
            height: '56px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
            <span>eRTMAC-NWIS</span>
            <span>›</span>
            <span className="font-medium" style={{ color: '#1e293b' }}>
              {currentPage === 'overview' && 'Drilling Intelligence Overview'}
              {currentPage === 'nearby-wells' && 'Nearby Wells Intelligence'}
              {currentPage === 'active-well' && 'Active Well Monitor'}
              {currentPage === 'well-intelligence' && 'Well Intelligence'}
              {currentPage === 'risk-monitor' && 'Drilling Risk Monitor'}
              {currentPage === 'knowledge-base' && 'Knowledge Base'}
              {currentPage === 'reports' && 'Reports'}
              {currentPage === 'alerts' && 'Alerts'}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* eRTMAC connection status */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#16a34a' }} />
              eRTMAC Connected
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-8 h-8 flex items-center justify-center rounded"
                style={{ color: '#64748b' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {activeAlertCount > 0 && (
                  <div
                    className="absolute top-0 right-0 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: '#dc2626', fontSize: '9px' }}
                  >
                    {activeAlertCount}
                  </div>
                )}
              </button>

              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-80 rounded-md shadow-lg z-30 overflow-hidden"
                  style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-2.5 border-b"
                    style={{ borderColor: '#f1f5f9', backgroundColor: '#f8fafc' }}
                  >
                    <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>Active Alerts</span>
                    <button
                      onClick={() => { setCurrentPage('alerts'); setNotifOpen(false); }}
                      className="text-xs font-medium"
                      style={{ color: '#1d4ed8' }}
                    >
                      View all
                    </button>
                  </div>
                  {unreadNotifications.map((alert) => (
                    <div
                      key={alert.id}
                      className="px-4 py-3 border-b cursor-pointer hover:bg-slate-50"
                      style={{ borderColor: '#f1f5f9' }}
                      onClick={() => { setCurrentPage('alerts'); setNotifOpen(false); }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{
                            backgroundColor:
                              alert.type === 'critical' ? '#dc2626' :
                              alert.type === 'warning' ? '#d97706' : '#2563eb',
                          }}
                        />
                        <div>
                          <div className="text-xs font-medium" style={{ color: '#1e293b' }}>{alert.title}</div>
                          <div className="text-xs mt-0.5 line-clamp-1" style={{ color: '#64748b' }}>{alert.description}</div>
                          <div className="text-xs mt-0.5 font-mono" style={{ color: '#94a3b8' }}>{alert.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI assistant toggle */}
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border transition-colors"
              style={{
                borderColor: showAI ? '#1d4ed8' : '#e2e8f0',
                backgroundColor: showAI ? '#eff6ff' : 'white',
                color: showAI ? '#1d4ed8' : '#374151',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="16" width="2" height="7" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
                <rect x="11" y="10" width="2" height="13" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
                <rect x="18" y="13" width="2" height="10" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
                <circle cx="5" cy="14" r="2" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
                <circle cx="12" cy="8" r="2" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
                <circle cx="19" cy="11" r="2" fill={showAI ? '#1d4ed8' : '#94a3b8'} />
              </svg>
              Ask NWIS
            </button>

            {/* User */}
            <div
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded"
              style={{ color: '#64748b' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#1d4ed8' }}
              >
                RS
              </div>
              <div className="hidden xl:block">
                <div className="text-xs font-medium" style={{ color: '#1e293b' }}>R. Sharma</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>Drilling Engineer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 px-5 py-4 overflow-y-auto"
          style={{ marginTop: '56px' }}
          onClick={() => notifOpen && setNotifOpen(false)}
        >
          {renderPage()}
        </main>

        {/* Footer */}
        <footer
          className="px-5 py-2 text-xs flex items-center justify-between"
          style={{ borderTop: '1px solid #e2e8f0', backgroundColor: 'white', color: '#94a3b8' }}
        >
          <span>eRTMAC-NWIS v2.4.1 · Oil India Limited · Demonstration Environment</span>
          <span>Data as of: 29 Sep 2026 · 10:24 IST</span>
        </footer>
      </div>

      {/* AI Assistant panel */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
}
