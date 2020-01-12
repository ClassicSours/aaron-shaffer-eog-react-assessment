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
import { Provider, createClient, useQuery } from 'urql';
import { getMetrics } from '../../resources/queries';

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

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
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
  const { metrics, selectedMetrics } = useSelector(getState);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.setSelectedMetrics(event.target.value as string[]));
  };

  const handleClear = () => {
    dispatch(actions.setSelectedMetrics([]));
  };

  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName));
  };

  const [result] = useQuery({ query: getMetrics });
  const { data, error, fetching } = result;
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
  );
};
