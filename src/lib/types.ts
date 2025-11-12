export interface QueueMetrics {
  lambda: number;
  mu: number;
  rho: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
  P: number[];
  idleTime: number;
  idleProportion: number;
  avgServiceTime: number;
  waitingTimes: number[];
  idleTimes: number[];
  interArrivals: number[];
  serviceTimes: number[];
  timestamps: number[];
}

export interface Service {
  id: string;
  name: string;
  arrivalQueue: string;
  serviceQueue: string;
  metrics: QueueMetrics;
  serviceTimes: number[];
  timestamps: number[];
  interArrivals: number[];
}
