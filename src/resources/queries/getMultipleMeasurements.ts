import gql from 'graphql-tag';
export const getMultipleMeasurements = gql`
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        value
        metric
        unit
        __typename
      }
      __typename
    }
    __typename
  }
`;
