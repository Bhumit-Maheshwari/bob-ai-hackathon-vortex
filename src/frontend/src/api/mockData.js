// Mock data — used as fallback when the backend is not available
export const MOCK_SHIPMENTS = [
  {
    id: 'SHP-001', trackingNo: 'TRK-20240101', origin: 'Shanghai', destination: 'Los Angeles',
    status: 'In-Transit', eta: '2024-08-15', carrier: 'Maersk', route: 'ASIA-US-WEST',
    hasColdChain: true,
    timeline: [
      { timestamp: '2024-07-20 08:00', event: 'Shipment Created', location: 'Shanghai Warehouse' },
      { timestamp: '2024-07-22 14:30', event: 'Departed Origin Port', location: 'Shanghai Port' },
      { timestamp: '2024-08-01 09:15', event: 'In Transit - Pacific', location: 'Pacific Ocean' },
      { timestamp: '2024-08-14 06:00', event: 'Arrived Destination Port', location: 'Los Angeles Port', current: true },
    ],
    coldChainReadings: [
      { id: 'CCR-001', sensor: 'S1-Front', temperature: 2.4, humidity: 78, timestamp: '2024-08-14 06:00', status: 'ok' },
      { id: 'CCR-002', sensor: 'S2-Rear',  temperature: 3.1, humidity: 80, timestamp: '2024-08-14 06:00', status: 'ok' },
      { id: 'CCR-003', sensor: 'S1-Front', temperature: 7.8, humidity: 85, timestamp: '2024-08-14 05:00', status: 'breach' },
    ],
  },
  {
    id: 'SHP-002', trackingNo: 'TRK-20240102', origin: 'Hamburg', destination: 'New York',
    status: 'Delayed', eta: '2024-08-20', carrier: 'MSC', route: 'EU-US-EAST',
    hasColdChain: false,
    timeline: [
      { timestamp: '2024-07-25 10:00', event: 'Shipment Created', location: 'Hamburg Warehouse' },
      { timestamp: '2024-07-28 16:00', event: 'Departed Origin Port', location: 'Hamburg Port' },
      { timestamp: '2024-08-10 12:00', event: 'Port Hold — Documentation', location: 'Rotterdam', current: true },
    ],
    coldChainReadings: [],
  },
  {
    id: 'SHP-003', trackingNo: 'TRK-20240103', origin: 'Dubai', destination: 'Mumbai',
    status: 'On-Time', eta: '2024-08-12', carrier: 'DP World', route: 'ME-IN',
    hasColdChain: true,
    timeline: [
      { timestamp: '2024-08-05 09:00', event: 'Shipment Created', location: 'Dubai Warehouse' },
      { timestamp: '2024-08-06 14:00', event: 'Departed Origin Port', location: 'Jebel Ali Port' },
      { timestamp: '2024-08-11 18:00', event: 'Arrived Destination Port', location: 'JNPT Mumbai', current: true },
    ],
    coldChainReadings: [
      { id: 'CCR-004', sensor: 'S1-Main', temperature: 4.2, humidity: 75, timestamp: '2024-08-11 18:00', status: 'ok' },
    ],
  },
  {
    id: 'SHP-004', trackingNo: 'TRK-20240104', origin: 'Singapore', destination: 'Rotterdam',
    status: 'Critical', eta: '2024-08-25', carrier: 'CMA CGM', route: 'ASIA-EU',
    hasColdChain: false,
    timeline: [
      { timestamp: '2024-07-30 11:00', event: 'Shipment Created', location: 'Singapore Warehouse' },
      { timestamp: '2024-08-01 08:00', event: 'Departed Origin Port', location: 'PSA Singapore' },
      { timestamp: '2024-08-09 14:00', event: 'Route Diverted — Suez Congestion', location: 'Indian Ocean', current: true },
    ],
    coldChainReadings: [],
  },
  {
    id: 'SHP-005', trackingNo: 'TRK-20240105', origin: 'Tokyo', destination: 'Sydney',
    status: 'On-Time', eta: '2024-08-16', carrier: 'NYK Line', route: 'ASIA-PACIFIC',
    hasColdChain: true,
    timeline: [
      { timestamp: '2024-08-08 10:00', event: 'Shipment Created', location: 'Tokyo Warehouse' },
      { timestamp: '2024-08-09 20:00', event: 'Departed Origin Port', location: 'Tokyo Port' },
      { timestamp: '2024-08-15 09:00', event: 'Approaching Destination', location: 'Tasman Sea', current: true },
    ],
    coldChainReadings: [
      { id: 'CCR-005', sensor: 'S1-Main', temperature: 1.8, humidity: 72, timestamp: '2024-08-15 09:00', status: 'ok' },
      { id: 'CCR-006', sensor: 'S2-Top',  temperature: 2.1, humidity: 74, timestamp: '2024-08-15 09:00', status: 'ok' },
    ],
  },
];

export const MOCK_DISRUPTIONS = [
  {
    id: 'DIS-001', type: 'Port Congestion', severity: 'Critical',
    affectedRoutes: ['ASIA-EU', 'ME-EU'],
    description: 'Severe congestion at Suez Canal entry point due to vessel backlog. Average delay: 4–6 days.',
    detectedAt: '2024-08-10 06:00', resolved: false,
  },
  {
    id: 'DIS-002', type: 'Weather Event', severity: 'High',
    affectedRoutes: ['ASIA-US-WEST', 'ASIA-PACIFIC'],
    description: 'Typhoon Khanun tracking toward Taiwan Strait. Vessels rerouting via southern passage.',
    detectedAt: '2024-08-12 09:30', resolved: false,
  },
  {
    id: 'DIS-003', type: 'Labour Strike', severity: 'High',
    affectedRoutes: ['EU-US-EAST'],
    description: 'Dockers union strike at Hamburg port. Terminal operations at 40% capacity.',
    detectedAt: '2024-08-11 07:00', resolved: false,
  },
  {
    id: 'DIS-004', type: 'Customs Hold', severity: 'Medium',
    affectedRoutes: ['EU-US-EAST'],
    description: 'US Customs enhanced inspection protocols applied to EU pharmaceutical shipments.',
    detectedAt: '2024-08-09 14:00', resolved: false,
  },
  {
    id: 'DIS-005', type: 'Fuel Shortage', severity: 'Low',
    affectedRoutes: ['ME-IN'],
    description: 'Bunkering delays reported at Colombo. Minor schedule adjustments expected.',
    detectedAt: '2024-08-08 11:00', resolved: true,
  },
];

export const MOCK_FLEET = [
  { id: 'VH-001', vehicleNo: 'TRK-A1001', type: 'Refrigerated Truck', status: 'Active',  currentLoad: 18, capacity: 20, location: 'Los Angeles, CA', driver: 'James Carter' },
  { id: 'VH-002', vehicleNo: 'TRK-A1002', type: 'Dry Van',             status: 'Active',  currentLoad: 14, capacity: 20, location: 'Chicago, IL',     driver: 'Maria Santos' },
  { id: 'VH-003', vehicleNo: 'TRK-A1003', type: 'Flatbed',             status: 'Idle',    currentLoad: 0,  capacity: 25, location: 'Houston, TX',      driver: 'Tom Williams' },
  { id: 'VH-004', vehicleNo: 'TRK-B2001', type: 'Refrigerated Truck', status: 'Active',  currentLoad: 20, capacity: 20, location: 'Miami, FL',        driver: 'Linda Park' },
  { id: 'VH-005', vehicleNo: 'TRK-B2002', type: 'Tanker',              status: 'Maintenance', currentLoad: 0, capacity: 30, location: 'Dallas, TX',   driver: 'Carlos Rivera' },
  { id: 'VH-006', vehicleNo: 'TRK-B2003', type: 'Dry Van',             status: 'Active',  currentLoad: 9,  capacity: 20, location: 'Seattle, WA',      driver: 'Sara Lee' },
  { id: 'VH-007', vehicleNo: 'TRK-C3001', type: 'Refrigerated Truck', status: 'Idle',    currentLoad: 0,  capacity: 20, location: 'New York, NY',     driver: 'Mike Brown' },
  { id: 'VH-008', vehicleNo: 'TRK-C3002', type: 'Flatbed',             status: 'Active',  currentLoad: 22, capacity: 25, location: 'Phoenix, AZ',      driver: 'Ana Gomez' },
];

export const MOCK_FLEET_UTIL = {
  totalVehicles: 8, active: 5, idle: 2, maintenance: 1,
  utilisationPct: 62.5,
};

export const MOCK_COLD_CHAIN = [
  { id: 'CCR-001', shipmentId: 'SHP-001', trackingNo: 'TRK-20240101', sensor: 'S1-Front', temperature: 2.4, humidity: 78, threshold: { min: -2, max: 6 }, timestamp: '2024-08-14 06:00', status: 'ok' },
  { id: 'CCR-002', shipmentId: 'SHP-001', trackingNo: 'TRK-20240101', sensor: 'S2-Rear',  temperature: 3.1, humidity: 80, threshold: { min: -2, max: 6 }, timestamp: '2024-08-14 06:00', status: 'ok' },
  { id: 'CCR-003', shipmentId: 'SHP-001', trackingNo: 'TRK-20240101', sensor: 'S1-Front', temperature: 7.8, humidity: 85, threshold: { min: -2, max: 6 }, timestamp: '2024-08-14 05:00', status: 'breach' },
  { id: 'CCR-004', shipmentId: 'SHP-003', trackingNo: 'TRK-20240103', sensor: 'S1-Main',  temperature: 4.2, humidity: 75, threshold: { min: 2, max: 8 },  timestamp: '2024-08-11 18:00', status: 'ok' },
  { id: 'CCR-005', shipmentId: 'SHP-005', trackingNo: 'TRK-20240105', sensor: 'S1-Main',  temperature: 1.8, humidity: 72, threshold: { min: 0, max: 4 },  timestamp: '2024-08-15 09:00', status: 'ok' },
  { id: 'CCR-006', shipmentId: 'SHP-005', trackingNo: 'TRK-20240105', sensor: 'S2-Top',   temperature: 2.1, humidity: 74, threshold: { min: 0, max: 4 },  timestamp: '2024-08-15 09:00', status: 'ok' },
];

export const MOCK_RECOMMENDATIONS = [
  {
    id: 'REC-001', priority: 'Critical',
    title: 'Reroute SHP-004 via Cape of Good Hope',
    description: 'Suez Canal congestion adds 5+ days. Cape route costs 2% more but saves 4 days ETA.',
    action: 'Reroute via Cape',
  },
  {
    id: 'REC-002', priority: 'High',
    title: 'Pre-book buffer cold storage — LAX',
    description: 'SHP-001 temp breach detected. Arrange cold storage at LAX to prevent cargo loss.',
    action: 'Book Storage',
  },
  {
    id: 'REC-003', priority: 'High',
    title: 'Reassign idle fleet to Chicago hub',
    description: 'TRK-A1003 and TRK-C3001 are idle. Chicago hub has 3 pending deliveries.',
    action: 'Reassign Vehicles',
  },
  {
    id: 'REC-004', priority: 'Medium',
    title: 'Switch SHP-002 carrier to Hapag-Lloyd',
    description: 'Hamburg strike affecting MSC operations. Hapag-Lloyd has capacity on EU-US-EAST.',
    action: 'Change Carrier',
  },
];
