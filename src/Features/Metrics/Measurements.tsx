import React, {useEffect, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Card, CardHeader} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import { Measurement } from '../../types/Measurement';

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
    // width: "auto !important",
    minWidth: "325px",
    float: "left",
    clear: "both",  
  },
  subheader: {
    textAlign: "right"
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
});

const MeasurmentsCard = (props: ComponentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {metricName, actions} = props
  
  const [result] = useQuery({
    query,
    variables: {
      metricName
    },
    pollInterval: 1300,
    requestPolicy: 'cache-and-network'
  })

  const [measurement, setMeasurment] = React.useState<Measurement>()
  const memoizedSetMeasurement = useCallback(
    (getLastKnownMeasurement) => {
      setMeasurment(getLastKnownMeasurement)
    },
    [],
  );

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName))
  }

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getLastKnownMeasurement } = data;
    memoizedSetMeasurement(getLastKnownMeasurement)
    dispatch(actions.measurementDataRecieved(getLastKnownMeasurement));
  }, [dispatch, data, error, actions, memoizedSetMeasurement]);

  if (fetching || !measurement) return <LinearProgress />;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={measurement.metric}
        titleTypographyProps={{variant:"h6", component:"h6", noWrap:true}}
        subheader={`${measurement.value} ${measurement.unit}`}
        subheaderTypographyProps={{variant:"h3", component:"h3", noWrap:true, className:classes.subheader}}
        action={
          <IconButton 
            className={classes.iconButton}
            onClick={(e) => handleDelete(measurement.metric)}
            >
            <CloseIcon />
          </IconButton>
        }
      />
    </Card>
  )
}