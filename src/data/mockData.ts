export type WellStatus = 'drilling' | 'completed' | 'suspended' | 'plugged';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type EventType = 'mud-loss' | 'stuck-pipe' | 'high-torque' | 'kick' | 'overpressure' | 'cementing-issue' | 'npt' | 'normal';

export interface DrillingEvent {
  id: string;
  depth: number;
  type: EventType;
  description: string;
  severity: RiskLevel;
  mitigation?: string;
  duration?: number; // hours of NPT
}

export interface Well {
  id: string;
  name: string;
  x: number; // SVG map position (0-100)
  y: number;
  type: 'active' | 'historical';
  status: WellStatus;
  depth: number;
  formation: string;
  location: string;
  distance?: number; // km from active well
  similarity?: number; // percent
  drillingPeriod?: string;
  events: DrillingEvent[];
  casings?: Array<{ type: string; depth: number; size: string }>;
  mudWeight?: number; // ppg
}

export interface RiskSignal {
  id: string;
  type: string;
  level: RiskLevel;
  currentDepth: number;
  depthZoneStart: number;
  depthZoneEnd: number;
  historicalMatches: number;
  confidence: number;
  status: 'approaching' | 'in-zone' | 'past' | 'monitoring';
  description: string;
  affectedWells: string[];
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  depth?: number;
  time: string;
  resolved: boolean;
  wellId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'WCR' | 'DDR' | 'MLR' | 'CR';
  wellId: string;
  date: string;
  status: 'processing' | 'processed' | 'failed';
  extractedEvents: number;
  fileSize: string;
}

export const ACTIVE_WELL_ID = 'OIL-XX-01';

export const wells: Well[] = [
  {
    id: 'OIL-XX-01',
    name: 'OIL-XX-01',
    x: 50,
    y: 50,
    type: 'active',
    status: 'drilling',
    depth: 3280,
    formation: 'XYZ Formation',
    location: 'Upper Assam Block, Field A',
    drillingPeriod: 'Aug 2026 – Present',
    mudWeight: 10.2,
    events: [
      { id: 'e1', depth: 1200, type: 'normal', description: 'Drilling normal', severity: 'low' },
      { id: 'e2', depth: 2400, type: 'high-torque', description: 'Elevated torque observed, drilling paused 2h', severity: 'medium', mitigation: 'Reduced WOB, resumed drilling', duration: 2 },
      { id: 'e3', depth: 3100, type: 'mud-loss', description: 'Partial mud loss — 15 bbl/hr', severity: 'medium', mitigation: 'LCM added, mud weight reduced', duration: 4 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 600, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2800, size: '13-3/8"' },
    ],
  },
  {
    id: 'OIL-XX-02',
    name: 'OIL-XX-02',
    x: 58,
    y: 42,
    type: 'historical',
    status: 'completed',
    depth: 4120,
    formation: 'XYZ Formation',
    location: 'Upper Assam Block, Field A',
    distance: 2.8,
    similarity: 71,
    drillingPeriod: 'Jan 2024 – Jun 2024',
    mudWeight: 10.6,
    events: [
      { id: 'e1', depth: 1400, type: 'normal', description: 'Drilling normal', severity: 'low' },
      { id: 'e2', depth: 2800, type: 'high-torque', description: 'High torque, extended reaming required', severity: 'medium', mitigation: 'Reaming, optimized RPM', duration: 6 },
      { id: 'e3', depth: 3245, type: 'mud-loss', description: 'Severe mud loss — 40 bbl/hr', severity: 'high', mitigation: 'LCM pills + reduced ECD', duration: 18 },
      { id: 'e4', depth: 3600, type: 'cementing-issue', description: 'Poor cement bond across ABC formation', severity: 'medium', mitigation: 'Remedial squeeze job performed', duration: 12 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 650, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2900, size: '13-3/8"' },
      { type: 'Production', depth: 4100, size: '9-5/8"' },
    ],
  },
  {
    id: 'OIL-XX-03',
    name: 'OIL-XX-03',
    x: 43,
    y: 38,
    type: 'historical',
    status: 'completed',
    depth: 3980,
    formation: 'XYZ Formation',
    location: 'Upper Assam Block, Field A',
    distance: 4.2,
    similarity: 82,
    drillingPeriod: 'Mar 2023 – Sep 2023',
    mudWeight: 10.4,
    events: [
      { id: 'e1', depth: 2800, type: 'normal', description: 'Smooth drilling', severity: 'low' },
      { id: 'e2', depth: 3120, type: 'high-torque', description: 'High torque detected, possible tight formation', severity: 'medium', mitigation: 'Reduced WOB, increased RPM', duration: 3 },
      { id: 'e3', depth: 3245, type: 'mud-loss', description: 'Mud loss into fractured XYZ Formation zone', severity: 'high', mitigation: 'LCM + balanced drilling', duration: 24 },
      { id: 'e4', depth: 3310, type: 'normal', description: 'Mitigation applied, drilling resumed', severity: 'low' },
      { id: 'e5', depth: 3750, type: 'stuck-pipe', description: 'Differential sticking in sandstone zone', severity: 'high', mitigation: 'Spotting oil, jar operations', duration: 36 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 620, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2900, size: '13-3/8"' },
      { type: 'Production', depth: 3960, size: '9-5/8"' },
    ],
  },
  {
    id: 'OIL-XX-04',
    name: 'OIL-XX-04',
    x: 62,
    y: 60,
    type: 'historical',
    status: 'completed',
    depth: 3640,
    formation: 'ABC Formation',
    location: 'Upper Assam Block, Field B',
    distance: 5.1,
    similarity: 58,
    drillingPeriod: 'Sep 2022 – Feb 2023',
    mudWeight: 11.0,
    events: [
      { id: 'e1', depth: 2200, type: 'kick', description: 'Gas kick — minor, controlled', severity: 'medium', mitigation: 'Shut in, weighted up mud', duration: 8 },
      { id: 'e2', depth: 3280, type: 'mud-loss', description: 'Mud loss in ABC Formation, 20 bbl/hr', severity: 'medium', mitigation: 'LCM treatment', duration: 10 },
      { id: 'e3', depth: 3540, type: 'overpressure', description: 'Overpressure zone encountered', severity: 'high', mitigation: 'Increased mud weight to 12.2 ppg', duration: 6 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 600, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2700, size: '13-3/8"' },
      { type: 'Production', depth: 3620, size: '9-5/8"' },
    ],
  },
  {
    id: 'OIL-XX-05',
    name: 'OIL-XX-05',
    x: 38,
    y: 58,
    type: 'historical',
    status: 'completed',
    depth: 4280,
    formation: 'Sandstone Zone',
    location: 'Upper Assam Block, Field A',
    distance: 6.4,
    similarity: 49,
    drillingPeriod: 'Apr 2021 – Dec 2021',
    mudWeight: 10.8,
    events: [
      { id: 'e1', depth: 3100, type: 'mud-loss', description: 'Lost circulation — limestone intercalation', severity: 'medium', mitigation: 'LCM + gasified mud', duration: 16 },
      { id: 'e2', depth: 3900, type: 'npt', description: 'Equipment NPT — pump failure', severity: 'medium', duration: 20 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 680, size: '18-5/8"' },
      { type: 'Intermediate', depth: 3100, size: '13-3/8"' },
      { type: 'Production', depth: 4260, size: '9-5/8"' },
    ],
  },
  {
    id: 'OIL-XX-06',
    name: 'OIL-XX-06',
    x: 55,
    y: 32,
    type: 'historical',
    status: 'completed',
    depth: 3520,
    formation: 'Shale Zone',
    location: 'Upper Assam Block, Field C',
    distance: 7.8,
    similarity: 44,
    drillingPeriod: 'Jun 2020 – Nov 2020',
    mudWeight: 11.2,
    events: [
      { id: 'e1', depth: 2600, type: 'stuck-pipe', description: 'Stuck pipe in reactive shale', severity: 'high', mitigation: 'KCl mud system, reaming', duration: 48 },
      { id: 'e2', depth: 3200, type: 'cementing-issue', description: 'Channeling in cement — poor zonal isolation', severity: 'medium', mitigation: 'Remedial cement job', duration: 14 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 600, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2700, size: '13-3/8"' },
    ],
  },
  {
    id: 'OIL-XX-07',
    name: 'OIL-XX-07',
    x: 44,
    y: 66,
    type: 'historical',
    status: 'completed',
    depth: 4050,
    formation: 'XYZ Formation',
    location: 'Upper Assam Block, Field A',
    distance: 8.3,
    similarity: 76,
    drillingPeriod: 'Feb 2022 – Aug 2022',
    mudWeight: 10.5,
    events: [
      { id: 'e1', depth: 2900, type: 'high-torque', description: 'High torque, tight formation', severity: 'medium', mitigation: 'Lubricant added, WOB reduced', duration: 4 },
      { id: 'e2', depth: 3310, type: 'mud-loss', description: 'Mud loss — fracture zone at 3310m', severity: 'high', mitigation: 'LCM squeeze + reduced MW', duration: 28 },
      { id: 'e3', depth: 3850, type: 'kick', description: 'Minor gas influx during connection', severity: 'medium', mitigation: 'Shut in, circulated out', duration: 6 },
    ],
    casings: [
      { type: 'Conductor', depth: 80, size: '30"' },
      { type: 'Surface', depth: 640, size: '18-5/8"' },
      { type: 'Intermediate', depth: 2900, size: '13-3/8"' },
      { type: 'Production', depth: 4030, size: '9-5/8"' },
    ],
  },
];

export const riskSignals: RiskSignal[] = [
  {
    id: 'rs1',
    type: 'Mud Loss',
    level: 'medium',
    currentDepth: 3280,
    depthZoneStart: 3200,
    depthZoneEnd: 3350,
    historicalMatches: 4,
    confidence: 82,
    status: 'in-zone',
    description: '4 nearby wells experienced mud loss in XYZ Formation at similar depth. Current drilling parameters show increasing similarity to pre-loss signatures.',
    affectedWells: ['OIL-XX-02', 'OIL-XX-03', 'OIL-XX-07', 'OIL-XX-05'],
  },
  {
    id: 'rs2',
    type: 'Stuck Pipe',
    level: 'low',
    currentDepth: 3280,
    depthZoneStart: 3700,
    depthZoneEnd: 3850,
    historicalMatches: 2,
    confidence: 58,
    status: 'approaching',
    description: '2 wells experienced differential sticking at deeper intervals in sandstone zone. Monitor increased drag and torque as indicator.',
    affectedWells: ['OIL-XX-03', 'OIL-XX-06'],
  },
  {
    id: 'rs3',
    type: 'Overpressure',
    level: 'low',
    currentDepth: 3280,
    depthZoneStart: 3480,
    depthZoneEnd: 3560,
    historicalMatches: 1,
    confidence: 41,
    status: 'approaching',
    description: 'Overpressure zone detected in OIL-XX-04 at 3540m. Formation pressure gradient may transition. Monitor d-exponent trend.',
    affectedWells: ['OIL-XX-04'],
  },
];

export const alerts: Alert[] = [
  {
    id: 'a1',
    type: 'warning',
    title: 'Potential Mud Loss Risk — XYZ Formation',
    description: 'Current depth (3,280 m) is within historical mud loss interval (3,200–3,350 m). 4 nearby wells have recorded events at similar depth-formation signature.',
    depth: 3280,
    time: '09:42',
    resolved: false,
    wellId: 'OIL-XX-01',
  },
  {
    id: 'a2',
    type: 'info',
    title: 'Historical Risk Zone — Depth 3,200–3,350 m',
    description: 'Active well has entered historically documented mud-loss interval. Similar formation transitions observed in OIL-XX-03 and OIL-XX-07.',
    depth: 3200,
    time: '09:35',
    resolved: false,
    wellId: 'OIL-XX-01',
  },
  {
    id: 'a3',
    type: 'info',
    title: 'Offset Well Analysis Updated',
    description: 'Similarity score recalculated for nearby wells. OIL-XX-03 now shows 82% similarity with current drilling parameters.',
    time: '09:21',
    resolved: false,
  },
  {
    id: 'a4',
    type: 'info',
    title: 'Real-time Data Synchronized',
    description: 'eRTMAC data stream reconnected. All parameters updated as of 09:20.',
    time: '08:55',
    resolved: true,
  },
  {
    id: 'a5',
    type: 'critical',
    title: 'HIGH TORQUE — Action Required',
    description: 'Torque trending 22% above baseline. Historical pattern match: OIL-XX-03 at 3,120m showed identical signature before tight formation encounter.',
    depth: 3280,
    time: '08:42',
    resolved: true,
    wellId: 'OIL-XX-01',
  },
];

export const documents: Document[] = [
  {
    id: 'd1',
    name: 'WCR_OIL_XX_03.pdf',
    type: 'WCR',
    wellId: 'OIL-XX-03',
    date: '2023-09-15',
    status: 'processed',
    extractedEvents: 5,
    fileSize: '4.2 MB',
  },
  {
    id: 'd2',
    name: 'DDR_OIL_XX_02_Q1_2024.pdf',
    type: 'DDR',
    wellId: 'OIL-XX-02',
    date: '2024-06-10',
    status: 'processed',
    extractedEvents: 8,
    fileSize: '12.7 MB',
  },
  {
    id: 'd3',
    name: 'MLR_OIL_XX_07_2022.pdf',
    type: 'MLR',
    wellId: 'OIL-XX-07',
    date: '2022-08-30',
    status: 'processed',
    extractedEvents: 3,
    fileSize: '8.1 MB',
  },
  {
    id: 'd4',
    name: 'CR_OIL_XX_04_2023.pdf',
    type: 'CR',
    wellId: 'OIL-XX-04',
    date: '2023-02-22',
    status: 'processed',
    extractedEvents: 2,
    fileSize: '2.8 MB',
  },
  {
    id: 'd5',
    name: 'WCR_OIL_XX_06_2020.pdf',
    type: 'WCR',
    wellId: 'OIL-XX-06',
    date: '2020-11-18',
    status: 'processed',
    extractedEvents: 4,
    fileSize: '5.9 MB',
  },
];

export const liveData = {
  depth: 3280,
  rop: 18.4,
  wob: 24.6,
  rpm: 110,
  torque: 14280,
  mudFlow: 880,
  standpipePressure: 2840,
  temperature: 124,
  mudWeight: 10.2,
  gasUnits: 42,
};

export const realtimeTrend = {
  depth: [3240, 3248, 3255, 3262, 3268, 3272, 3276, 3280],
  rop: [19.2, 18.8, 18.6, 18.4, 18.1, 18.3, 18.5, 18.4],
  torque: [12800, 13100, 13400, 13600, 13800, 14050, 14180, 14280],
  pressure: [2720, 2750, 2780, 2800, 2815, 2828, 2836, 2840],
};

export const depthComparison = {
  depths: [1000, 1500, 2000, 2500, 3000, 3100, 3200, 3245, 3280, 3350, 3500],
  wells: {
    'OIL-XX-01': {
      torque: [4200, 5100, 6800, 8200, 10400, 11200, 12600, 13800, 14280, null, null],
      rop: [28, 25, 22, 20, 19, 18, 17, 15, 18.4, null, null],
      mudFlow: [820, 830, 845, 860, 870, 875, 878, 880, 880, null, null],
    },
    'OIL-XX-03': {
      torque: [4000, 4900, 6500, 8000, 10200, 11800, 13200, 15600, 16200, 14000, 11000],
      rop: [30, 26, 23, 21, 20, 17, 14, 10, 12, 18, 22],
      mudFlow: [810, 825, 840, 855, 865, 872, 876, 879, 881, 876, 870],
    },
    'OIL-XX-07': {
      torque: [4100, 5000, 6600, 8100, 10300, 11600, 12900, 14800, 15400, 13200, 10800],
      rop: [29, 25, 22, 20, 19, 18, 15, 11, 14, 20, 24],
      mudFlow: [815, 828, 842, 857, 867, 873, 877, 880, 882, 875, 868],
    },
    'OIL-XX-02': {
      torque: [4300, 5200, 7000, 8400, 10600, 11400, 13000, 15200, 15800, 13600, 11200],
      rop: [27, 24, 21, 19, 18, 17, 14, 10, 13, 19, 23],
      mudFlow: [822, 832, 848, 862, 872, 878, 880, 882, 884, 878, 872],
    },
  },
};

export const knowledgeBaseEntries = [
  {
    id: 'kb1',
    wellId: 'OIL-XX-03',
    depth: 3245,
    event: 'Mud Loss',
    formation: 'XYZ Formation',
    severity: 'high' as RiskLevel,
    cause: 'Fracture network in XYZ Formation — natural fractures reopened due to ECD exceeding formation pressure',
    mitigation: 'LCM pill (20 ppb mica + 30 ppb calcium carbonate), reduced ECD via controlled ROP and flow rate, monitored return flow',
    outcome: 'Losses controlled within 24 hrs. Drilling resumed at 0.8× original ROP.',
    date: '2023-06-14',
  },
  {
    id: 'kb2',
    wellId: 'OIL-XX-02',
    depth: 3245,
    event: 'Mud Loss',
    formation: 'XYZ Formation',
    severity: 'high' as RiskLevel,
    cause: 'High ECD during circulation in fractured carbonate zone. Connection losses observed before total losses.',
    mitigation: 'LCM pills followed by cement plug. Reduced mud weight by 0.4 ppg. Gasified mud used in subsequent section.',
    outcome: 'Losses reduced to 5 bbl/hr manageable level. Section drilled to casing point with monitoring.',
    date: '2024-03-22',
  },
  {
    id: 'kb3',
    wellId: 'OIL-XX-07',
    depth: 3310,
    event: 'Mud Loss',
    formation: 'XYZ Formation',
    severity: 'high' as RiskLevel,
    cause: 'Open fracture at 3310m intersected formation boundary. Surge pressure during trip triggered losses.',
    mitigation: 'Spotting LCM slug, reducing pipe speed during trips, managed pressure drilling approach.',
    outcome: 'Total NPT 28 hrs. Losses stopped after LCM squeeze. No further losses in section.',
    date: '2022-05-08',
  },
  {
    id: 'kb4',
    wellId: 'OIL-XX-03',
    depth: 3750,
    event: 'Stuck Pipe',
    formation: 'Sandstone Zone',
    severity: 'high' as RiskLevel,
    cause: 'Differential sticking in highly permeable sandstone with large pressure differential (>1800 psi overbalance)',
    mitigation: 'Spotted diesel oil with surfactant, applied jar operations (up and down), reduced mud weight',
    outcome: 'Pipe freed after 36 hrs. Costly NPT. Formation damage noted in logs.',
    date: '2023-07-30',
  },
  {
    id: 'kb5',
    wellId: 'OIL-XX-04',
    depth: 3540,
    event: 'Overpressure',
    formation: 'ABC Formation',
    severity: 'high' as RiskLevel,
    cause: 'Undercompacted shale transition into overpressured zone. d-exponent showed decreasing trend for 80m before encounter.',
    mitigation: 'Shut in, increased mud weight from 11.0 to 12.2 ppg in staged increments. Used PWD for real-time ECD monitoring.',
    outcome: 'Formation pressure controlled. No kicks. Continued with 12.2 ppg mud through section.',
    date: '2023-01-15',
  },
];
