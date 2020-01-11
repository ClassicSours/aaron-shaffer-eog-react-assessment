import React from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {
  cacheExchange,
  createClient,
  debugExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
  dedupExchange,
} from 'urql';

const subscription=`
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit,
  }
}
`
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
  return (
    <div>
      {"Hello World"}
    </div>
  )
}
