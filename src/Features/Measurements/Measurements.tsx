import React, {useEffect} from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const getMeasurements = (state: IState) => {
  const { metric, at, value, unit } = state.measurements;
  console.log(state)
  return {
    metric, at, value, unit
  };
};

const query=`
query($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    at
    value
    unit
  }
}
`;

export default (props: ComponentProps) => {
  return (
    <Provider value={client}>
      <Measurments 
        {...props}
      />
    </Provider>
  )
}

interface ComponentProps {
  metric: string;
}

const Measurments = (props: ComponentProps) => {
  return (
    <div>
      {`Measurements Works ${props.metric}`}
    </div>
  )
}