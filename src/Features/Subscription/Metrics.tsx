import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import {
  cacheExchange,
  createClient,
  debugExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
  dedupExchange,
  useQuery,
  useSubscription
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { 
  LinearProgress,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  InputAdornment,
  Grid, 
  GridList,
  GridListTile,
  Chip
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { actions } from './reducer'
import { IState } from '../../store';
import { Measurement } from '../../types';
import { subscribe } from 'graphql';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    gridList: {
      height: "100%",
      width: "100%",
    },
    grid: {
      padding: "30px"
    },
    formControl: {
      width: "100%",
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    select: {
      width: "100%"
    },
    iconButton: {
      "&:hover": {
        backgroundColor: "transparent"
      }
    }
  }),
);

const query=gql`
query {
  getMetrics
}
`;

const subscription=gql`
subscription newMeasurement {
  newMeasurement {
    metric,
    at,
    value,
    unit
  }
}
`;

const subscriptionClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql',
  {}
);

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => {
       console.log(operation)
       return subscriptionClient.request(operation)
      }
    }),
  ],
});

const getMetrics = (state: IState) => {
  return {
    ...state.metrics2
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricsSubscription />
    </Provider>
  )
}

const MetricsSubscription = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { metrics, measurements, selectedMetrics } = useSelector(getMetrics)

  const [queryResult] = useQuery({query: query});
  const [subscriptionResult] = useSubscription({query: subscription});

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.setSelectedMetrics(event.target.value as string[]))
  };

  const handleClear = () => {
    dispatch(actions.setSelectedMetrics([]))
  }

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName))
  }

  useEffect(() => {
    if(queryResult.error) {
      dispatch(actions.metricsApiErrorReceived({error: queryResult.error.message}))
      return;
    }
    if(subscriptionResult.error) {
      dispatch(actions.metricsApiErrorReceived({error: subscriptionResult.error.message}))
      return;
    }
    if (!queryResult.data) return;
    dispatch(actions.getMetrics(queryResult.data));
    if(!subscriptionResult.data) return;
    let { newMeasurement } = subscriptionResult.data
    dispatch(actions.measurementDataRecieved(newMeasurement))
  },[dispatch, queryResult,subscriptionResult, actions])

  if (queryResult.fetching) return <LinearProgress />;
  // console.log(queryResult)
  // console.log(subscriptionResult)
  return (
    <div>
      {"SubscriptionClient"}
      {metrics}
      {measurements.forEach(measurement => 
        <div>
          {measurement}
        </div>
      )}
      {selectedMetrics}
    </div>
  )
}
