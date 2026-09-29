import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12"
        style={{ backgroundColor: '#0f1e3b' }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#1a3260' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="16" width="2" height="7" fill="#38bdf8" />
                <rect x="11" y="10" width="2" height="13" fill="#38bdf8" />
                <rect x="18" y="13" width="2" height="10" fill="#38bdf8" />
                <circle cx="5" cy="14" r="2.5" fill="#0ea5e9" />
                <circle cx="12" cy="8" r="2.5" fill="#0ea5e9" />
                <circle cx="19" cy="11" r="2.5" fill="#0ea5e9" />
                <path d="M5 14 L12 8 L19 11" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 1.5" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight leading-none">eRTMAC-NWIS</div>
              <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Nearby Wells Intelligence System</div>
            </div>
          </div>

          <div className="mb-12">
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#38bdf8' }}
            >
              Oil India Limited
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-5">
              AI-Powered Drilling<br />Intelligence Platform
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
              Turning historical drilling experience into proactive decisions. Real-time offset well intelligence for safer, more efficient drilling operations.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-4">
            {[
              { icon: '◈', text: 'Offset Well Pattern Matching', sub: 'Compare against 100+ historical wells' },
              { icon: '◈', text: 'Depth-wise Risk Prediction', sub: 'AI-identified hazard zones before entry' },
              { icon: '◈', text: 'Document Intelligence', sub: 'OCR + NLP extraction from drilling reports' },
              { icon: '◈', text: 'Real-time eRTMAC Integration', sub: 'Live parameter monitoring and alerting' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xs mt-0.5" style={{ color: '#38bdf8' }}>{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white">{item.text}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-8" style={{ borderColor: '#1a3260' }}>
          <p className="text-xs italic" style={{ color: '#475569' }}>
            "Know what happened. Understand what is happening. Anticipate what may happen next."
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#0f1e3b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="16" width="2" height="7" fill="#38bdf8" />
              <rect x="11" y="10" width="2" height="13" fill="#38bdf8" />
              <rect x="18" y="13" width="2" height="10" fill="#38bdf8" />
              <circle cx="5" cy="14" r="2.5" fill="#0ea5e9" />
              <circle cx="12" cy="8" r="2.5" fill="#0ea5e9" />
              <circle cx="19" cy="11" r="2.5" fill="#0ea5e9" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: '#0f1e3b' }}>eRTMAC-NWIS</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#0f1e3b' }}>Sign In</h2>
            <p className="text-sm" style={{ color: '#64748b' }}>Access your drilling intelligence dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>
                Email / Employee ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eng.firstname@oilindia.in"
                className="w-full px-3 py-2.5 text-sm rounded-md border outline-none transition-all"
                style={{
                  borderColor: '#e2e8f0',
                  backgroundColor: '#fff',
                  color: '#1e293b',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-md border outline-none transition-all"
                style={{
                  borderColor: '#e2e8f0',
                  backgroundColor: '#fff',
                  color: '#1e293b',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded"
                  style={{ accentColor: '#2563eb' }}
                />
                <span className="text-xs" style={{ color: '#64748b' }}>Remember me</span>
              </label>
              <button type="button" className="text-xs font-medium" style={{ color: '#2563eb' }}>
                Forgot password?
              </button>
            </div>

            {error && (
              <div
                className="text-xs px-3 py-2 rounded"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-md transition-opacity"
              style={{ backgroundColor: loading ? '#93c5fd' : '#1d4ed8' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="15 50" />
                  </svg>
                  Authenticating…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#16a34a' }}
              />
              <span className="text-xs" style={{ color: '#64748b' }}>System operational</span>
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              Authorized Oil India Limited personnel only
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-xs" style={{ color: '#cbd5e1' }}>
            eRTMAC-NWIS v2.4.1 · Demonstration Environment
          </p>
        </div>
      </div>
    </div>
  );
}
