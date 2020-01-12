import gql from 'graphql-tag';
export const getLastKnownMeasurement = gql`
  {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;
