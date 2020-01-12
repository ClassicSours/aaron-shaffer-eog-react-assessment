import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, createClient } from 'urql';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { actions } from './reducer';
import { IState } from '../../store';
import { getMultipleMeasurements } from '../../resources/queries';
import { LinearProgress } from '@material-ui/core';

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
  const { measurementQuery } = useSelector(getState);

  const [result, executeQuery] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      measurementQuery,
    },
    requestPolicy: 'cache-and-network',
  });

  useCallback(() => {
    executeQuery({ requestPolicy: measurementQuery.length === 0 ? 'cache-only' : 'network-only' });
  }, [executeQuery, measurementQuery.length]);

  const { error, data } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    dispatch(actions.multipleMeasurementsDataReceived(newMeasurement));
  }, [dispatch, data, error]);

  return <div>works</div>;
};
