import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IState } from '../store';

import Measurements from '../Features/Measurements/Measurements';
import Metrics from '../Features/Metrics/Metrics';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%'
    },
    grid: {
      padding: '5px',
      width: '100%',
    },
    formControl: {
      width: '100%',
    },
    select: {
      width: '100%',
    },
    iconButton: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }),
);

const getState = (state: IState) => {
  const {metrics, measurements} = state
  return {
    metrics,
    measurements,
  }
}

export default () => {
  const classes = useStyles();
  const state = useSelector(getState)
  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="flex-end" alignItems="flex-start" alignContent="flex-start" className={classes.grid}>
        <Grid item xs={8} className={classes.grid}>
          <Measurements />
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <Metrics />
        </Grid>
        {/* <HistoricalMetrics /> */}
      </Grid>
    </div>
  )
}