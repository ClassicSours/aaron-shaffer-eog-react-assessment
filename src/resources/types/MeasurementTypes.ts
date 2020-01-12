import Measurements from '../../Features/Measurements/Measurements';

export type MEASUREMENT = {
  metric: string;
  at: number;
  value: number;
  unit: string;
  __typename: string;
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
