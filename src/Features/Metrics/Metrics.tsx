import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import {
  cacheExchange,
  createClient,
  debugExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
  dedupExchange,
  useQuery,
  useMutation,
  useSubscription
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { 
  LinearProgress,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  InputAdornment,
  Grid, 
  GridList,
  GridListTile,
  Chip
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { actions } from './reducer'
import { IState } from '../../store';
import CurrentMetricData from '../../components/CurrentMetricData'
// import Plotly from '../../components/Plotly'
// import PlotMetrics from '../../components/PlotMetrics'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    gridList: {
      height: "100%",
      width: "100%",
    },
    grid: {
      padding: "30px"
    },
    formControl: {
      width: "100%",
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    select: {
      width: "100%"
    },
    iconButton: {
      "&:hover": {
        backgroundColor: "transparent"
      }
    }
  }),
);

const query=gql`
query {
  getMetrics
}
`;

const getLastKnownMeasurementQuery=gql`
query($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    at
    value
    unit
  }
}
`;

const subscription=gql`
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit
  }
}
`;
const mutation=gql`
query ($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric 
    measurements {
      at
      value
      metric
      unit
    }
  }
} 
`

const subscriptionClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql',
  {}
);

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    // debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => {
       console.log(operation)
       return subscriptionClient.request(operation)
      }
    }),
  ],
});

const getMetrics = (state: IState) => {
  return {
    ...state.metrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  )
}

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { metrics, selectedMetrics, newMeasurements } = useSelector(getMetrics)

  const [queryResult] = useQuery({query: query});

  const [subscriptionResult] = useSubscription({query: subscription});
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.setSelectedMetrics(event.target.value as string[]))
  };

  const handleClear = () => {
    dispatch(actions.setSelectedMetrics([]))
  }

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName))
  }

  useEffect(() => {
    if(queryResult.error) {
      dispatch(actions.metricsApiErrorReceived({error: queryResult.error.message}))
      return;
    }
    if(subscriptionResult.error) {
      dispatch(actions.metricsApiErrorReceived({error: subscriptionResult.error.message}))
      return;
    }
    if (!queryResult.data) return;
    dispatch(actions.getMetrics(queryResult.data));
    if(!subscriptionResult.data) return;
    let { newMeasurement } = subscriptionResult.data
    dispatch(actions.measurementDataRecieved(newMeasurement))
  },[dispatch, queryResult,subscriptionResult])

  if (queryResult.fetching) return <LinearProgress />;
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
        alignContent="flex-start"
      >
        <Grid item xs={7} className={classes.grid}>
          <GridList cellHeight={'auto'} className={classes.gridList} cols={3} spacing={15}>
            {selectedMetrics.map(metric => {
              const measurement = newMeasurements.get(metric);
              if (measurement) {
                return (<GridListTile key={metric} cols={1}>
                  <CurrentMetricData 
                    measurement={measurement} 
                    actions={actions} 
                  />
                </GridListTile>);
              }
            })}
          </GridList>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4} className={classes.grid}>
          <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="metric-select-label">Metrics</InputLabel>
          <Select
            multiple
            id="metric-select"
            value={selectedMetrics}
            onChange={handleChange}
            className={classes.select}
            endAdornment={
              <InputAdornment position="start">
                <IconButton
                  className={classes.iconButton}
                  onClick={handleClear}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            }
            renderValue={selected => (
              <div className={classes.chips}>
                  {(selected as string[]).map(value => (
                  <Chip 
                    key={value}
                    label={value}
                    className={classes.chip}
                    onDelete={(e) => handleDelete(value)}
                    deleteIcon={<CloseIcon id={value}/>}
                  />
                ))}
              </div>
            )}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left"
              },
              getContentAnchorEl:null,
            }}
            >
            { 
              selectedMetrics.length === metrics.length ? ( 
                <MenuItem disabled key={''} value={''}>
                  {'No Options'}
                </MenuItem> 
                ) : (
                metrics
                  .filter(metric => !selectedMetrics.includes(metric))
                  .map(metric => (
                    <MenuItem key={metric} value={metric}>
                      {metric}
                    </MenuItem> 
                  ))
                )
              }
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <Plotly
          />
        </Grid>
        <Grid item xs={12}>
          <PlotMetrics
          />
        </Grid> */}
      </Grid>
    </div>
  )
}
