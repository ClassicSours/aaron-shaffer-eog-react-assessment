import React, { useCallback } from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { IState } from '../../store';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { MeasurementEntry, Measurement, MeasurementResponse } from './components';
import gql from 'graphql-tag';
import { actions } from './reducer'

const subscriptionClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql',
  {}
);

const query=gql`
query {
  getMetrics
}
`;

const subscription=gql`
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit,
  }
}
`;

const getMetrics = (state: IState) => {
  return {
    ...state.metrics2
  };
};
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    // debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

export default () => {
  return (
    <Provider value={client}>
      <MetricsSubscription />
    </Provider>
  )
}

const MetricsSubscription = () => {
  const dispatch = useDispatch();

  const { metrics, measurements, selectedMetrics } = useSelector(getMetrics)

  const [queryResult] = useQuery({
    query: query
  });

  const [subscriptionResult] = useSubscription({ 
    query: subscription
  });

  const { fetching } = queryResult;
  useCallback(() => {
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
    dispatch(actions.measurementDataRecieved(subscriptionResult.data))
  },[queryResult,subscriptionResult])

  if (fetching) return <LinearProgress />;

  return (
    <div>
      {"SubscriptionClient"}
      {metrics}
      {measurements}
      {selectedMetrics}
    </div>
  )
}
