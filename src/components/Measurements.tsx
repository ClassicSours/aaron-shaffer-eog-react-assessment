import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Measurement } from '../Features/Metrics/reducer';
import { makeStyles, Card, CardHeader} from '@material-ui/core';

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

const useStyles = makeStyles({
  card: {
    width: '100%',
    minWidth: '200px',
  }
});

const MeasurmentsCard = (props: ComponentProps) => {
  const classes = useStyles();
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
    setMeasurment(getLastKnownMeasurement as Measurement)
    dispatch(actions.measurementDataRecieved(getLastKnownMeasurement));
    const interval = setInterval(() => {
      executeQuery()
    }, 1300);
    return () => clearInterval(interval);
  }, [dispatch, data, error, actions, executeQuery]);

  if (fetching || !measurement) return <LinearProgress />;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={measurement!.metric}
        titleTypographyProps={{variant:"h6", component:"h6", noWrap:true}}
        subheader={`${measurement!.value} ${measurement!.unit}`}
        subheaderTypographyProps={{variant:"h3", component:"h3", noWrap:true}}
      />
    </Card>
  )
}