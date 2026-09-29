import { useState } from 'react';

interface AIAssistantProps {
  onClose: () => void;
}

const suggestedQuestions = [
  'What happened around 3200 m in nearby wells?',
  'Which wells had mud loss in XYZ Formation?',
  'What mitigation was used for stuck pipe?',
  'Show me the highest risk events at current depth',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  links?: Array<{ label: string; action: string }>;
}

const autoResponses: Record<string, Message> = {
  '3200': {
    role: 'assistant',
    content:
      '4 nearby wells recorded mud-loss events between 3,200–3,350 m in XYZ Formation. The pattern is consistent: fracture networks in the XYZ Formation intercept with elevated ECD at this interval.\n\n● OIL-XX-03 — Mud loss at 3,245 m (24 hrs NPT)\n● OIL-XX-02 — Mud loss at 3,245 m (18 hrs NPT)\n● OIL-XX-07 — Mud loss at 3,310 m (28 hrs NPT)\n● OIL-XX-05 — Mud loss at 3,100 m (16 hrs NPT)\n\nAll cases were mitigated with LCM pills. Recommend monitoring ECD closely and preparing LCM treatment.',
    links: [{ label: 'View Evidence', action: 'risk-monitor' }, { label: 'View Wells', action: 'nearby-wells' }],
  },
  'mud loss': {
    role: 'assistant',
    content:
      '3 wells in XYZ Formation experienced mud loss — OIL-XX-02, OIL-XX-03, and OIL-XX-07. All events occurred between 3,200–3,350 m depth. Common mitigation approach was Lost Circulation Material (LCM) treatment with reduced ECD strategy.',
    links: [{ label: 'Knowledge Base', action: 'knowledge-base' }],
  },
  'stuck pipe': {
    role: 'assistant',
    content:
      'Stuck pipe events were recorded in 2 nearby wells:\n\n● OIL-XX-03 at 3,750 m — Differential sticking in sandstone zone. Mitigated with diesel oil spotting and jar operations (36 hrs NPT).\n● OIL-XX-06 at 2,600 m — Reactive shale sticking. KCl mud system and reaming applied.\n\nCurrent depth (3,280 m) is not in a historically documented stuck pipe zone, but monitor increasing drag as an early indicator.',
    links: [{ label: 'View OIL-XX-03', action: 'well-intelligence' }],
  },
  default: {
    role: 'assistant',
    content:
      'I found relevant information in the nearby well database. Please ask a more specific question about a depth range, well event type, or formation to get detailed historical evidence. For example: "What happened at 3200 m?" or "Which wells had mud loss?"',
    links: [],
  },
};

export default function AIAssistant({ onClose }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'NWIS Intelligence is ready. I can answer questions about nearby well history, formation events, risk zones, and mitigation actions — backed by historical drilling data.',
      links: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let response = autoResponses.default;
      if (lower.includes('3200') || lower.includes('3,200')) response = autoResponses['3200'];
      else if (lower.includes('mud loss') || lower.includes('mud-loss') || lower.includes('lcm')) response = autoResponses['mud loss'];
      else if (lower.includes('stuck')) response = autoResponses['stuck pipe'];

      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 900);
  };

  return (
    <div
      className="fixed bottom-4 right-4 w-80 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        height: '460px',
        maxHeight: 'calc(100vh - 2rem)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: '#0f1e3b', borderColor: '#1a3260' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ade80' }} />
          <span className="text-sm font-semibold text-white">Ask NWIS</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#1a3260', color: '#94a3b8' }}>
            AI
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-sm"
          style={{ color: '#64748b' }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-5 h-5 rounded mr-2 mt-0.5 flex items-center justify-center"
                style={{ backgroundColor: '#0f1e3b' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="16" width="2" height="7" fill="#38bdf8" />
                  <rect x="11" y="10" width="2" height="13" fill="#38bdf8" />
                  <rect x="18" y="13" width="2" height="10" fill="#38bdf8" />
                </svg>
              </div>
            )}
            <div
              className="max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed"
              style={{
                backgroundColor: msg.role === 'user' ? '#1d4ed8' : '#f8fafc',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : undefined,
                whiteSpace: 'pre-line',
              }}
            >
              {msg.content}
              {msg.links && msg.links.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: '#e2e8f0' }}>
                  {msg.links.map((link) => (
                    <button
                      key={link.label}
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: '#0f1e3b' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="16" width="2" height="7" fill="#38bdf8" />
                <rect x="11" y="10" width="2" height="13" fill="#38bdf8" />
                <rect x="18" y="13" width="2" height="10" fill="#38bdf8" />
              </svg>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: '#94a3b8', animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-3 pb-2">
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.slice(0, 2).map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-2 py-1 rounded-full truncate max-w-full"
              style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
            >
              {q.length > 36 ? q.slice(0, 36) + '…' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about nearby well history…"
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: '#1e293b' }}
          />
          <button
            onClick={() => sendMessage(input)}
            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ backgroundColor: '#1d4ed8' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-1.5">
          <span className="text-xs" style={{ color: '#cbd5e1', fontSize: '10px' }}>
            Answers grounded in historical well data
          </span>
        </div>
      </div>
    </div>
  );
}
