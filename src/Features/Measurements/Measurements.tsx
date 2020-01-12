import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Provider,
  useSubscription,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  createClient,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { actions } from './reducer';
import { IState } from '../../store';
import { newMeasurement } from '../../resources/queries';
import { MeasurementCard } from '../../components/MeasurementCard';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: {
      height: '100%',
      width: '100%',
    },
  }),
);

export default () => {
  return (
    <Provider value={client}>
      <Measurements />
    </Provider>
  );
};

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

const getState = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  return {
    selectedMetrics,
    ...state.measurements,
  };
};

const Measurements = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedMetrics, recentMeasurements } = useSelector(getState);
  const [result] = useSubscription({ query: newMeasurement });

  const { error, data } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    dispatch(actions.measurementDataRecieved(newMeasurement));
  }, [dispatch, data, error]);

  if (!recentMeasurements) return <LinearProgress />;

  return (
    <Grid item xs={12}>
      <GridList cellHeight={'auto'} className={classes.gridList} cols={3} spacing={15}>
        {selectedMetrics.map(metric => {
          return (
            <GridListTile key={metric} cols={1} id={metric}>
              <MeasurementCard metric={metric} measurements={recentMeasurements} actions={actions} />
            </GridListTile>
          );
        })}
      </GridList>
    </Grid>
  );
};
