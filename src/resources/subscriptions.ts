import gql from 'graphql-tag'
export const subscription = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }:[Measurement]
`;
