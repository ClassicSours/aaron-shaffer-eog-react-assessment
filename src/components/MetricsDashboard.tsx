import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Measurements from '../Features/Measurements/Measurements';
import Metrics from '../Features/Metrics/Metrics';
import MultipleMeasurements from '../Features/MultipleMeasurements/MultipleMeasurements';

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
        alignItems="center"
        alignContent="flex-start"
        className={classes.grid}
      >
        <Grid item xs={8} className={classes.grid}>
          <Measurements />
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <Metrics />
        </Grid>
        <Grid container className={classes.grid}>
          <MultipleMeasurements />
        </Grid>
      </Grid>
    </div>
  );
};
