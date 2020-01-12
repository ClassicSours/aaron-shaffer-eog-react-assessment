import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Measurement from '../Features/Measurements/Measurement';
import Measurements from '../Features/Measurements/Measurements';

import Metrics from '../Features/Metrics/Metrics';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
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

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
        alignContent="flex-start"
        className={classes.grid}
      >
        <Grid item xs={8} className={classes.grid}>
          <Measurement />
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <Metrics />
        </Grid>
        <Grid container className={classes.grid} alignContent={'center'}>
          <Measurements />
        </Grid>
      </Grid>
    </div>
  );
};
