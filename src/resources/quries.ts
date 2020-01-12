import gql from 'graphql-tag'

export const getHeartbeat = gql`
{
  getHeartbeat
}`

export const getMeasurements = gql`{
  getMeasurements
}`

export const getMetrics = gql`
  query {
    getMetrics
  }
`;

export const getLastKnownMeasurement = gql`
  query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

export const getMultipleMeasurements = gql`
  query($measurementQuery: [MeasurementQuery]) {
    getMultipleMeasurements(measurementQuery: $measurementQuery) {
      metric
      measurements {
        at
        value
        metric
        unit
      }
    }
  }
`;