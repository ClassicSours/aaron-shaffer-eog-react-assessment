import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import LinearProgress from '@material-ui/core/LinearProgress';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const getMeasurements = (state: IState) => {
  const { metric, at, value, unit } = state.measurements;
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
  metricName: string;
}

const Measurments = (props: ComponentProps) => {
  const dispatch = useDispatch();
  const {metricName} = props
  const {metric, at, value, unit} = useSelector(getMeasurements);
  const [result] = useQuery({
    query,
    variables: {
      metricName
    }
  })
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getLastKnownMeasurement } = data;
    dispatch(actions.measurementDataRecieved(getLastKnownMeasurement));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return (
    <div>
      {`metric: ${metric}`}
      <br />
      {`at: ${at}`}
      <br />
      {`value: ${value}`}
      <br />
      {`unit: ${unit}`}
    </div>
  )
}