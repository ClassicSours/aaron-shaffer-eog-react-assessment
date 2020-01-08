import React from 'react';
import { Provider, createClient } from 'urql';

import SelectMetrics from '../Features/Metrics/SelectMetrics';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  return (
    <div>
      <SelectMetrics />
    </div>
  )
}