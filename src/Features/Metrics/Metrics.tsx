import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getMetrics, heartBeat, getMultipleMeasurements } from '../../resources/queries';
import {
  Provider,
  useSubscription,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  createClient,
  useQuery,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { newMeasurement } from '../../resources/queries';
import { MeasurementCard } from '../../components/MeasurementCard';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    gridList: {
      height: '100%',
      width: '100%',
    },
    grid: {
      padding: '30px',
    },
    formControl: {
      width: '100%',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
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

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    // debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const getState = (state: IState) => {
  return {
    ...state.metrics,
  };
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics, selectedMetrics, measurementQuery, measurements, recentMeasurements } = useSelector(getState);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.setSelectedMetrics(event.target.value as string[]));
  };

  const handleClear = () => {
    dispatch(actions.setSelectedMetrics([]));
  };

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName));
  };

  // first get metrics for the drop down.
  const [METRICS_RESULT] = useQuery({ query: getMetrics });
  let { fetching } = METRICS_RESULT;
  const { data, error } = METRICS_RESULT;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.setMetrics(data));
  }, [dispatch, error, data]);
  if (fetching) return <LinearProgress />;

  return (
    <FormControl className={classes.formControl} variant="outlined">
      <InputLabel>Metrics</InputLabel>
      <Select
        multiple
        value={selectedMetrics}
        onChange={handleChange}
        className={classes.select}
        endAdornment={
          <InputAdornment position="start">
            <IconButton className={classes.iconButton} onClick={handleClear}>
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
                onDelete={e => handleDelete(value)}
                deleteIcon={<CloseIcon id={value} />}
              />
            ))}
          </div>
        )}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
      >
        {selectedMetrics.length === metrics.length ? (
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
        )}
      </Select>
    </FormControl>
  );
};
