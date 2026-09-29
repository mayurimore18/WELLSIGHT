import { useState } from 'react';
import GISMap from '../components/GISMap';
import { wells, Well } from '../data/mockData';

interface NearbyWellsProps {
  onNavigate: (page: string) => void;
  onSelectWell: (well: Well) => void;
}

const eventColors: Record<string, { bg: string; text: string }> = {
  'mud-loss': { bg: '#fef3c7', text: '#92400e' },
  'stuck-pipe': { bg: '#fee2e2', text: '#991b1b' },
  'high-torque': { bg: '#fef9c3', text: '#713f12' },
  'kick': { bg: '#fce7f3', text: '#9d174d' },
  'overpressure': { bg: '#fee2e2', text: '#991b1b' },
  'cementing-issue': { bg: '#e0e7ff', text: '#3730a3' },
  'npt': { bg: '#f3e8ff', text: '#6b21a8' },
};

const eventLabels: Record<string, string> = {
  'mud-loss': 'Mud Loss',
  'stuck-pipe': 'Stuck Pipe',
  'high-torque': 'High Torque',
  'kick': 'Kick',
  'overpressure': 'Overpressure',
  'cementing-issue': 'Cement Issue',
  'npt': 'NPT',
};

export default function NearbyWells({ onNavigate, onSelectWell }: NearbyWellsProps) {
  const [radius, setRadius] = useState(10);
  const [formationFilter, setFormationFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);

  const historicalWells = wells.filter((w) => w.type === 'historical');
  const filteredWells = historicalWells.filter((w) => {
    if (w.distance && w.distance > radius) return false;
    if (formationFilter !== 'all' && !w.formation.includes(formationFilter)) return false;
    if (eventFilter !== 'all' && !w.events.some((e) => e.type === eventFilter)) return false;
    return true;
  });

  const formations = ['all', 'XYZ', 'ABC', 'Sandstone', 'Shale'];
  const eventTypes = ['all', 'mud-loss', 'stuck-pipe', 'high-torque', 'kick', 'overpressure'];

  const toggleCompare = (wellId: string) => {
    setCompareList((prev) =>
      prev.includes(wellId) ? prev.filter((id) => id !== wellId) : [...prev, wellId].slice(0, 3)
    );
  };

  const similarityColor = (s?: number) => {
    if (!s) return '#94a3b8';
    if (s >= 75) return '#16a34a';
    if (s >= 55) return '#d97706';
    return '#64748b';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0f1e3b' }}>
            Nearby Wells Intelligence
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Discover historical wells around OIL-XX-01 and their drilling experience.
          </p>
        </div>
        {compareList.length >= 2 && (
          <button
            onClick={() => onNavigate('well-intelligence')}
            className="text-sm font-semibold px-3 py-1.5 rounded text-white"
            style={{ backgroundColor: '#1d4ed8' }}
          >
            Compare {compareList.length} Wells
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-md flex-wrap"
        style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>Radius:</span>
          {[5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className="text-xs px-2.5 py-1 rounded font-medium"
              style={{
                backgroundColor: radius === r ? '#1d4ed8' : '#f1f5f9',
                color: radius === r ? 'white' : '#374151',
              }}
            >
              {r} km
            </button>
          ))}
        </div>
        <div className="w-px h-4" style={{ backgroundColor: '#e2e8f0' }} />
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>Formation:</span>
          <select
            value={formationFilter}
            onChange={(e) => setFormationFilter(e.target.value)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ borderColor: '#e2e8f0', color: '#374151', backgroundColor: 'white' }}
          >
            {formations.map((f) => (
              <option key={f} value={f}>{f === 'all' ? 'All Formations' : f + ' Formation'}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>Event:</span>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ borderColor: '#e2e8f0', color: '#374151', backgroundColor: 'white' }}
          >
            <option value="all">All Events</option>
            {Object.entries(eventLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-xs" style={{ color: '#64748b' }}>
          <span className="font-semibold" style={{ color: '#0f1e3b' }}>{filteredWells.length}</span> wells found
        </div>
      </div>

      {/* Map + Well list */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
        {/* Map */}
        <div
          className="rounded-md overflow-hidden"
          style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
        >
          <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm font-semibold" style={{ color: '#0f1e3b' }}>
              Well Location Map
            </span>
            <span className="text-xs" style={{ color: '#94a3b8' }}>
              Active: OIL-XX-01 · Radius: {radius} km
            </span>
          </div>
          <div className="p-3">
            <GISMap
              onWellClick={(well) => setSelectedWell(well)}
              selectedWellId={selectedWell?.id}
              radius={radius}
              showRiskZones={true}
              showFormations={true}
              height={460}
            />
          </div>
        </div>

        {/* Well list */}
        <div className="space-y-2.5 overflow-y-auto" style={{ maxHeight: '540px' }}>
          {filteredWells.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: '#94a3b8' }}>
              No wells match current filters.
            </div>
          ) : (
            filteredWells.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)).map((well) => {
              const isSelected = selectedWell?.id === well.id;
              const inCompare = compareList.includes(well.id);
              const significantEvents = well.events.filter((e) => e.type !== 'normal');

              return (
                <div
                  key={well.id}
                  className="rounded-md overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: 'white',
                    border: isSelected ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
                  }}
                  onClick={() => setSelectedWell(well)}
                >
                  <div
                    className="px-3 py-2 flex items-center justify-between border-b"
                    style={{ borderColor: '#f1f5f9', backgroundColor: isSelected ? '#eff6ff' : '#f8fafc' }}
                  >
                    <div>
                      <span className="text-sm font-bold" style={{ color: '#0f1e3b' }}>
                        {well.id}
                      </span>
                      <span className="text-xs ml-2" style={{ color: '#64748b' }}>
                        {well.distance} km away
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="font-bold text-sm"
                        style={{ color: similarityColor(well.similarity) }}
                      >
                        {well.similarity}%
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs" style={{ color: '#94a3b8' }}>Formation</div>
                        <div className="text-xs font-medium" style={{ color: '#1e293b' }}>{well.formation}</div>
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: '#94a3b8' }}>Depth</div>
                        <div className="text-xs font-mono font-medium" style={{ color: '#1e293b' }}>
                          {well.depth.toLocaleString()} m
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#94a3b8' }}>Key Events</div>
                      <div className="flex flex-wrap gap-1">
                        {significantEvents.slice(0, 3).map((ev) => {
                          const style = eventColors[ev.type] || { bg: '#f1f5f9', text: '#374151' };
                          return (
                            <span
                              key={ev.id}
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: style.bg, color: style.text, fontSize: '10px' }}
                            >
                              {eventLabels[ev.type] || ev.type}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Similarity bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: '#94a3b8' }}>
                        <span>Similarity</span>
                        <span style={{ color: similarityColor(well.similarity) }}>{well.similarity}%</span>
                      </div>
                      <div className="h-1 rounded-full" style={{ backgroundColor: '#f1f5f9' }}>
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${well.similarity}%`,
                            backgroundColor: similarityColor(well.similarity),
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWell(well);
                          onNavigate('well-intelligence');
                        }}
                        className="flex-1 py-1.5 text-xs font-semibold rounded text-white"
                        style={{ backgroundColor: '#1d4ed8' }}
                      >
                        View Intelligence
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(well.id);
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium rounded border transition-colors"
                        style={{
                          borderColor: inCompare ? '#1d4ed8' : '#e2e8f0',
                          color: inCompare ? '#1d4ed8' : '#64748b',
                          backgroundColor: inCompare ? '#eff6ff' : 'white',
                        }}
                      >
                        {inCompare ? 'Added' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
