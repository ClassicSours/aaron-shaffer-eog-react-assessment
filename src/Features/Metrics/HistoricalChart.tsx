//eslint-disable-next-line
import React, {useEffect} from 'react';
//eslint-disable-next-line
import { Provider, createClient, useQuery } from 'urql';
//eslint-disable-next-line
import LinearProgress from '@material-ui/core/LinearProgress';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default (props: ComponentProps) => {
  return (
    <Provider value={client}>
      <HistoricalChart
        {...props}
        />
    </Provider>
  )
}

interface ComponentProps {
  actions: any;
}

const HistoricalChart = (props: ComponentProps) => {
  return (
    <div>
      Historical Chart Works!
    </div>
  )
}