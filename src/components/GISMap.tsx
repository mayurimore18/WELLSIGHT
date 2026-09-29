import { useState } from 'react';
import { wells, Well } from '../data/mockData';

interface GISMapProps {
  onWellClick?: (well: Well) => void;
  selectedWellId?: string | null;
  radius?: number;
  showRiskZones?: boolean;
  showFormations?: boolean;
  height?: number;
}

const riskZones = [
  { x: 46, y: 46, rx: 12, ry: 8, color: '#d97706', label: '3200–3350m Mud Loss', opacity: 0.12 },
  { x: 50, y: 55, rx: 9, ry: 6, color: '#dc2626', label: '3450–3520m High Torque', opacity: 0.1 },
];

const formationZones = [
  { points: '20,30 70,25 80,60 15,65', color: '#0d9488', label: 'XYZ Formation', opacity: 0.07 },
  { points: '60,55 90,50 95,80 55,85', color: '#7c3aed', label: 'ABC Formation', opacity: 0.07 },
];

export default function GISMap({
  onWellClick,
  selectedWellId,
  radius = 10,
  showRiskZones = true,
  showFormations = true,
  height = 420,
}: GISMapProps) {
  const [hoveredWell, setHoveredWell] = useState<Well | null>(null);
  const [popup, setPopup] = useState<Well | null>(null);

  const activeWell = wells.find((w) => w.type === 'active')!;
  const radiusPercent = (radius / 20) * 30;

  const handleWellClick = (well: Well) => {
    setPopup(popup?.id === well.id ? null : well);
    onWellClick?.(well);
  };

  const getEventBadge = (well: Well) => {
    const events = well.events.filter((e) => e.type !== 'normal');
    return events.slice(0, 2).map((e) => {
      const labels: Record<string, string> = {
        'mud-loss': 'Mud Loss',
        'stuck-pipe': 'Stuck Pipe',
        'high-torque': 'High Torque',
        'kick': 'Kick',
        'overpressure': 'Overpressure',
        'cementing-issue': 'Cement Issue',
        'npt': 'NPT',
      };
      return labels[e.type] || e.type;
    });
  };

  return (
    <div className="relative rounded-md overflow-hidden" style={{ height, border: '1px solid #e2e8f0' }}>
      {/* Map background */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
        style={{ backgroundColor: '#e8edf2' }}
      >
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#d1d9e0" strokeWidth="0.15" />
          </pattern>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0.3" stdDeviation="0.4" floodColor="#00000033" />
          </filter>
        </defs>

        {/* Terrain base shapes — subtle topographic */}
        <ellipse cx="35" cy="40" rx="28" ry="20" fill="#dde6ed" opacity="0.6" />
        <ellipse cx="65" cy="55" rx="22" ry="18" fill="#d5e0e9" opacity="0.5" />
        <ellipse cx="50" cy="70" rx="30" ry="16" fill="#dde6ed" opacity="0.4" />
        <ellipse cx="20" cy="65" rx="18" ry="12" fill="#d5e0e9" opacity="0.4" />
        <ellipse cx="80" cy="30" rx="15" ry="12" fill="#dde6ed" opacity="0.4" />

        {/* Water feature */}
        <path d="M5 72 Q20 68 30 74 Q40 80 55 75 Q65 71 75 76 Q85 80 95 75 L95 100 L5 100 Z"
          fill="#c8d9e6" opacity="0.5" />

        {/* Grid */}
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Formation zones */}
        {showFormations &&
          formationZones.map((zone, i) => (
            <polygon
              key={i}
              points={zone.points}
              fill={zone.color}
              opacity={zone.opacity}
              stroke={zone.color}
              strokeWidth="0.3"
              strokeDasharray="1 0.5"
            />
          ))}

        {/* Risk zones */}
        {showRiskZones &&
          riskZones.map((zone, i) => (
            <ellipse
              key={i}
              cx={zone.x}
              cy={zone.y}
              rx={zone.rx}
              ry={zone.ry}
              fill={zone.color}
              opacity={zone.opacity}
              stroke={zone.color}
              strokeWidth="0.4"
              strokeDasharray="1.5 0.8"
            />
          ))}

        {/* Radius circle */}
        <circle
          cx={activeWell.x}
          cy={activeWell.y}
          r={radiusPercent}
          fill="none"
          stroke="#2563eb"
          strokeWidth="0.5"
          strokeDasharray="2 1.5"
          opacity="0.5"
        />
        {radius >= 20 && (
          <circle
            cx={activeWell.x}
            cy={activeWell.y}
            r={radiusPercent * 0.55}
            fill="none"
            stroke="#2563eb"
            strokeWidth="0.3"
            strokeDasharray="1.5 1"
            opacity="0.3"
          />
        )}

        {/* Connecting lines from active to historical wells */}
        {wells
          .filter((w) => w.type === 'historical' && w.distance && w.distance <= radius)
          .map((w) => (
            <line
              key={`line-${w.id}`}
              x1={activeWell.x}
              y1={activeWell.y}
              x2={w.x}
              y2={w.y}
              stroke="#2563eb"
              strokeWidth="0.2"
              strokeDasharray="1 0.8"
              opacity="0.25"
            />
          ))}

        {/* Historical wells */}
        {wells
          .filter((w) => w.type === 'historical')
          .map((well) => {
            const inRadius = well.distance && well.distance <= radius;
            const isSelected = selectedWellId === well.id;
            const isHovered = hoveredWell?.id === well.id;
            const hasHighRisk = well.events.some((e) => e.severity === 'high');

            return (
              <g key={well.id} style={{ cursor: 'pointer' }}
                onClick={() => handleWellClick(well)}
                onMouseEnter={() => setHoveredWell(well)}
                onMouseLeave={() => setHoveredWell(null)}
              >
                {isSelected && (
                  <circle cx={well.x} cy={well.y} r="4" fill="#2563eb" opacity="0.15" />
                )}
                <circle
                  cx={well.x}
                  cy={well.y}
                  r={isSelected || isHovered ? 2.8 : 2.2}
                  fill={
                    !inRadius
                      ? '#94a3b8'
                      : isSelected
                      ? '#1d4ed8'
                      : hasHighRisk
                      ? '#d97706'
                      : '#2563eb'
                  }
                  stroke="white"
                  strokeWidth="0.6"
                  opacity={inRadius ? 1 : 0.5}
                  filter={isSelected ? 'url(#shadow)' : undefined}
                />
                <text
                  x={well.x}
                  y={well.y - 3.5}
                  textAnchor="middle"
                  fontSize="2.2"
                  fill={inRadius ? '#1e293b' : '#94a3b8'}
                  fontFamily="Inter, sans-serif"
                  fontWeight={isSelected ? '600' : '500'}
                >
                  {well.id}
                </text>
              </g>
            );
          })}

        {/* Active well — star marker */}
        <g filter="url(#shadow)">
          <circle cx={activeWell.x} cy={activeWell.y} r="4.5" fill="#dc2626" opacity="0.15" />
          <polygon
            points={starPoints(activeWell.x, activeWell.y, 3.2, 1.6, 5)}
            fill="#dc2626"
            stroke="white"
            strokeWidth="0.4"
          />
          <text
            x={activeWell.x}
            y={activeWell.y + 5.5}
            textAnchor="middle"
            fontSize="2.2"
            fill="#1e293b"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
          >
            {activeWell.id}
          </text>
          <text
            x={activeWell.x}
            y={activeWell.y + 7.5}
            textAnchor="middle"
            fontSize="1.9"
            fill="#dc2626"
            fontFamily="Inter, sans-serif"
          >
            ACTIVE
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(2,2)">
          <rect width="24" height="20" rx="1" fill="white" opacity="0.9" />
          <polygon points={starPoints(3.5, 4, 2, 1, 5)} fill="#dc2626" />
          <text x="6.5" y="5" fontSize="2.2" fill="#374151" fontFamily="Inter, sans-serif">Active Well</text>
          <circle cx="3.5" cy="9" r="1.5" fill="#2563eb" stroke="white" strokeWidth="0.4" />
          <text x="6.5" y="10" fontSize="2.2" fill="#374151" fontFamily="Inter, sans-serif">Historical</text>
          <circle cx="3.5" cy="14" r="1.5" fill="#d97706" stroke="white" strokeWidth="0.4" />
          <text x="6.5" y="15" fontSize="2.2" fill="#374151" fontFamily="Inter, sans-serif">High Risk</text>
          {showRiskZones && (
            <>
              <rect x="1.5" y="17.5" width="4" height="2" rx="0.5" fill="#d97706" opacity="0.3" stroke="#d97706" strokeWidth="0.3" strokeDasharray="0.8 0.4" />
              <text x="6.5" y="19" fontSize="2.2" fill="#374151" fontFamily="Inter, sans-serif">Risk Zone</text>
            </>
          )}
        </g>

        {/* Compass */}
        <g transform="translate(91, 4)">
          <circle cx="4" cy="4" r="4" fill="white" opacity="0.9" />
          <text x="4" y="3" textAnchor="middle" fontSize="3" fill="#1e293b" fontFamily="Inter, sans-serif" fontWeight="700">N</text>
          <line x1="4" y1="1" x2="4" y2="0.5" stroke="#1e293b" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {['+', '−'].map((label) => (
          <button
            key={label}
            className="w-7 h-7 text-sm font-bold rounded flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#374151', lineHeight: 1 }}
          >
            {label}
          </button>
        ))}
        <button
          className="w-7 h-7 text-xs rounded flex items-center justify-center transition-colors mt-1"
          style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#374151' }}
          title="Layers"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>
      </div>

      {/* Well popup */}
      {popup && popup.type === 'historical' && (
        <div
          className="absolute bottom-3 left-3 w-52 rounded-md shadow-lg z-10"
          style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
        >
          <div className="px-3 py-2.5 border-b" style={{ borderColor: '#f1f5f9', backgroundColor: '#f8fafc' }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm" style={{ color: '#0f1e3b' }}>{popup.id}</div>
              <button
                onClick={() => setPopup(null)}
                className="text-xs"
                style={{ color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              Distance: {popup.distance} km
            </div>
          </div>
          <div className="px-3 py-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>Formation</div>
                <div className="text-xs font-medium" style={{ color: '#1e293b' }}>{popup.formation}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>Depth</div>
                <div className="text-xs font-medium font-mono" style={{ color: '#1e293b' }}>{popup.depth.toLocaleString()} m</div>
              </div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: '#94a3b8' }}>Historical Events</div>
              <div className="flex flex-wrap gap-1">
                {getEventBadge(popup).map((ev) => (
                  <span
                    key={ev}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '10px' }}
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>Similarity</div>
                <div className="text-sm font-bold" style={{ color: '#16a34a' }}>{popup.similarity}%</div>
              </div>
              <button
                className="text-xs font-semibold px-2.5 py-1.5 rounded"
                style={{ backgroundColor: '#1d4ed8', color: 'white' }}
                onClick={() => onWellClick?.(popup)}
              >
                View Intelligence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo label */}
      <div
        className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded"
        style={{ backgroundColor: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', fontSize: '10px' }}
      >
        Demonstration Data
      </div>
    </div>
  );
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}
