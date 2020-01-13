import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getMetrics, heartBeat, getMultipleMeasurements } from '../../resources/queries';
import {
  Provider,
  useSubscription,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  createClient,
  useQuery,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { newMeasurement } from '../../resources/queries';
import { MeasurementCard } from '../../components/MeasurementCard';
import { SelectMetrics } from '../../components/SelectMetrics';
import { useEffectOnce } from 'react-use';
import { ChartMeasurements } from '../../components/ChartMeasurements';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    item: {
      height: '100%',
      width: '100%',
    },
    container: {
      width: '100%',
      padding: '30px',
    },
    gridList: {
      margin: '15px',
    },
    tile: {
      textColor: 'black',
      minWidth: '325px',
      width: '100%',
      border: '10px',
    },
    formControl: {
      width: '100%',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    select: {
      width: '100%',
    },
    iconButton: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }),
);

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    // debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const getState = (state: IState) => {
  return {
    ...state.metrics,
  };
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics, selectedMetrics, measurementQuery, measurements, recentMeasurements } = useSelector(getState);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.setSelectedMetrics(event.target.value as string[]));
    executeQuery();
  };

  const handleClear = () => {
    dispatch(actions.setSelectedMetrics([]));
  };

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName));
  };

  // step zero, get heartbeat ( essentially ping )
  const [HEARTBEAT_RESULT] = useQuery({ query: heartBeat, requestPolicy: 'cache-only' });
  useEffectOnce(() => {
    if (HEARTBEAT_RESULT.error) {
      dispatch(actions.metricsApiErrorReceived({ error: HEARTBEAT_RESULT.error.message }));
      return;
    }
    if (!HEARTBEAT_RESULT.data) return;
    const { data } = HEARTBEAT_RESULT;
    dispatch(actions.setHeartbeat(data));
  });

  // first get metrics for the drop down.
  const [METRICS_RESULT] = useQuery({ query: getMetrics });
  useEffect(() => {
    if (METRICS_RESULT.error) {
      dispatch(actions.metricsApiErrorReceived({ error: METRICS_RESULT.error.message }));
      return;
    }
    if (!METRICS_RESULT.data) return;
    dispatch(actions.setMetrics(METRICS_RESULT.data));
  }, [dispatch, METRICS_RESULT.error, METRICS_RESULT.data]);

  // subscribe to metrics
  const [SUBSCRIPTION_RESULTS] = useSubscription({ query: newMeasurement });
  useEffect(() => {
    if (SUBSCRIPTION_RESULTS.error) {
      dispatch(actions.metricsApiErrorReceived({ error: SUBSCRIPTION_RESULTS.error.message }));
      return;
    }
    if (!SUBSCRIPTION_RESULTS.data) return;
    const { newMeasurement } = SUBSCRIPTION_RESULTS.data;
    dispatch(actions.measurementDataRecieved(newMeasurement));
  }, [dispatch, SUBSCRIPTION_RESULTS.data, SUBSCRIPTION_RESULTS.error]);

  // query for multiple metrics (since program start)
  const [multipleMeasurements, executeQuery] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      input: measurementQuery,
    },
    requestPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (multipleMeasurements.error) {
      dispatch(actions.metricsApiErrorReceived({ error: multipleMeasurements.error.message }));
      return;
    }
    if (!multipleMeasurements.data) return;
    dispatch(actions.multipleMeasurementsDataReceived(multipleMeasurements.data));
  }, [dispatch, multipleMeasurements.error, multipleMeasurements.data]);

  return (
    <div className={classes.root}>
      <Grid container alignContent={'center'} alignItems={'flex-start'} spacing={1} className={classes.container}>
        <Grid item xs={9} className={classes.item}>
          <GridList cellHeight={100} className={classes.gridList} cols={3}>
            {selectedMetrics.map(metric => {
              return (
                <GridListTile key={metric} cols={1} className={classes.tile}>
                  <MeasurementCard
                    metricName={metric}
                    classes={classes}
                    measurements={recentMeasurements}
                    handleDelete={handleDelete}
                    dispatch={dispatch}
                    actions={actions}
                  />
                </GridListTile>
              );
            })}
          </GridList>
        </Grid>
        <Grid item xs={3}>
          <SelectMetrics
            metrics={metrics}
            selectedMetrics={selectedMetrics}
            classes={classes}
            handleChange={handleChange}
            handleClear={handleClear}
            handleDelete={handleDelete}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartMeasurements metrics={selectedMetrics} data={measurements} recentMeasurements={recentMeasurements} />
        </Grid>
      </Grid>
    </div>
  );
};
