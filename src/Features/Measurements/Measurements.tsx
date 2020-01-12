import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, createClient } from 'urql';
import Grid from '@material-ui/core/Grid';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { actions } from './reducer';
import { IState } from '../../store';
import { getMultipleMeasurements } from '../../resources/queries';
import { LinearProgress } from '@material-ui/core';
import classes from '*.module.css';


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
})

export default () => {
  return (
    <Provider value={client}>
      <Measurements />
    </Provider>
  );
};

const getState = (state: IState) => {
  const {selectedMetrics} = state.metrics
  return {
    selectedMetrics,
    ...state.measurements,
  };
};

const Measurements = () => {
  return (
    <div>
      works
    </div>
  )
}