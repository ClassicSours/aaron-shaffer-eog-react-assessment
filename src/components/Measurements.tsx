import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Measurement } from '../Features/Metrics/reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

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
      <MeasurmentsCard 
        {...props}
      />
    </Provider>
  )
}

interface ComponentProps {
  metricName: string;
  actions: any;
}

const MeasurmentsCard = (props: ComponentProps) => {
  const dispatch = useDispatch();
  const {metricName, actions} = props
  const [result, executeQuery] = useQuery({
    query,
    variables: {
      metricName
    },
    requestPolicy: 'cache-and-network'
  })

  const [measurement, setMeasurment] = React.useState<Measurement>()
 
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getLastKnownMeasurement } = data;
    console.log(data)
    setMeasurment(getLastKnownMeasurement as Measurement)
    dispatch(actions.measurementDataRecieved(getLastKnownMeasurement));
    const interval = setInterval(() => {
      executeQuery()
    }, 1300);
    return () => clearInterval(interval);

  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  try {
  return (
    <div>
      {`metric: ${measurement!.metric}`}
      <br />
      {`at: ${measurement!.at}`}
      <br />
      {`value: ${measurement!.value}`}
      <br />
      {`unit: ${measurement!.unit}`}
    </div>
  )
  } catch(e) {
    return (
      <div>
      </div>
    )
  } 
}