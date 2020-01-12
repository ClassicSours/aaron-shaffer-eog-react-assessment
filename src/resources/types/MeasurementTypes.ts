export type Measurement = {
  metric: string;
  at: number;
  value: number;
  unit: string;
  __typename: string;
};

export type Measurements = {
  metric: string;
  measurements: Array<Measurement>;
  __typename: string;
};

export type MultipleMeasurements = {
  getMultipleMeasurements: Array<Measurements>;
  __typename: string;
};

export type MeasurementQuery = {
  metricName: string;
  after: number;
  before?: number;
};
