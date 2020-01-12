import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, createClient } from 'urql';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { actions } from './reducer';
import { IState } from '../../store';
import { getMultipleMeasurements } from '../../resources/queries';
import { LinearProgress } from '@material-ui/core';
import { LineChart, Line } from 'recharts';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <Measurements />
    </Provider>
  );
};

const getState = (state: IState) => {
  return {
    ...state.measurements,
  };
};

const Measurements = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { measurementQuery, multipleMeasurements } = useSelector(getState);

  const [result, executeQuery] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      input: measurementQuery,
    },
    requestPolicy: 'cache-only',
  });

  useEffect(() => {
    const requestPolicy = measurementQuery.length === 0 ? 'cache-only' : 'cache-and-network';
    executeQuery({ requestPolicy });
  }, [executeQuery, measurementQuery]);

  const { error, data, fetching } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    console.log(data);
    dispatch(actions.multipleMeasurementsDataReceived(getMultipleMeasurements));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return <LineChart></LineChart>;
};
