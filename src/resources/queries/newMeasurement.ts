import gql from 'graphql-tag'
export const newMeasurement = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
