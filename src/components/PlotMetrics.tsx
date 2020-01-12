import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {useQuery} from 'urql'
import { MeasurementQuery } from '../resources/types';
import {Grid} from '@material-ui/core'
const useStyles = makeStyles({});

export default (props: ComponentProps) => {
  const {xs, query, measurementQuery, actions} = props
  return (
    <Grid item xs={xs}>
      <PlotMetrics 
        query={query}
        measurementQuery={measurementQuery}
        actions={actions}
      />
    </Grid>
  );
};

interface ComponentProps {
  xs: any,
  query: string,
  measurementQuery: MeasurementQuery[],
  actions: any
}

interface MetricsProps{
  query: string,
  measurementQuery: MeasurementQuery[],
  actions: any
}

const PlotMetrics = (props: MetricsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {query, measurementQuery, actions} = props

  const [result] = useQuery({
    query: query,
    variables: {
      measurementQuery,
    },
  });

  // const memoizedSetMultipleMeasurements = useCallback(
  //   (getMultipleMeasurements) => {
  //     // setData
  //   },[]
  // )

  // const {fetching, data, error } = result;
  // useEffect(() => {
  //   if(error) {
  //     dispatch(actions.metricsApiErrorReceived({error:error.message}));
  //     return;
  //   }
  //   if(!data) return;
  //   const {getMultipleMeasurements} = data;
  //   memoizedSetMultipleMeasurements(getMultipleMeasurements)
  //   dispatch(actions.multipleMeasurementsDataRecieved(getMultipleMeasurements));
  // })

  return <div>{'plot metrics works'}</div>;
};
