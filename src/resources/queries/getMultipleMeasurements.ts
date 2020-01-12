import gql from 'graphql-tag'
export const getMultipleMeasurements = gql`
{
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