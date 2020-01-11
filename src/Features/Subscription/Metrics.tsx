import React, { useCallback, useEffect } from 'react';
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
import { MeasurementEntry, MeasurementResponse } from './components';
import gql from 'graphql-tag';
import { actions } from './reducer'
import { Measurement } from '../../types';
import { subscribe } from 'graphql';

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
  console.log(state)
  return {
    ...state.metrics2
  };
};
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    debugExchange,
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
  const [measurement, setMeasurment] = React.useState<Measurement>()
  
  const memoizedSetMeasurement = useCallback(
    (getLastKnownMeasurement) => {
      dispatch(actions.measurementDataRecieved(getLastKnownMeasurement))
    },
    [],
  );

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
    memoizedSetMeasurement(newMeasurement)
  },[dispatch, queryResult,subscriptionResult, actions, memoizedSetMeasurement])

  if (fetching) return <LinearProgress />;
  // console.log(queryResult)
  // console.log(subscriptionResult)
  return (
    <div>
      {"SubscriptionClient"}
      {metrics}
      {/* {measurements} */}
      {selectedMetrics}
    </div>
  )
}
