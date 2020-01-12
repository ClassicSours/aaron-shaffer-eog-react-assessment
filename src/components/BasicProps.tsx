import React from 'react';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default (props: ComponentProps) => {
  return (
    <Provider value={client}>
      <Component />
    </Provider>
  );
};

interface ComponentProps {}

const Component = (props: ComponentProps) => {
  return <div>"works"</div>;
};
