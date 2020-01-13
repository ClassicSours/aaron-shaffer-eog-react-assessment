export type MEASUREMENT = {
  metric: string;
  at: number;
  value: number;
  unit: string;
  __typename: string;
};

export type KEYED_MEASUREMENT = {
  metric: string;
  at: number;
  unit: string;
  value: number;
  dataKey: string;
};
export type MEASUREMENTS = {
  metric: string;
  measurements: Array<MEASUREMENT>;
  __typename: string;
};

export type MULTIPLE_MEASUREMENTS = {
  getMultipleMeasurements: Array<MEASUREMENTS>;
  __typename: string;
};

export type MEASUREMENTS_QUERY = {
  metricName: string;
  after: number;
  before?: number;
};
