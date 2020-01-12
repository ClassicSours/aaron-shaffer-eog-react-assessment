import gql from 'graphql-tag';
export const getMeasurements = gql`
  {
    getMeasurements(measurementQuery: $measurementQuery) {
      measurements {
        at
        value
        metric
        unit
      }
    }
  }
`;
