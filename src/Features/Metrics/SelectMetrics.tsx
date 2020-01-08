import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer'
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';

import Chip from '../../components/Chip'

import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    }
  }),
);

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMetrics
}
`;

const getMetrics = (state: IState) => {
  const { metrics } = state.metrics;
  console.log(state)
  return {
    metrics
  };
};


export default () => {
  return (
    <Provider value={client}>
      <SelectMetrics />
    </Provider>
  );
};

const SelectMetrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics);
  
  const [result] = useQuery({
    query
  });

  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([]);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetrics(event.target.value as string[]);
  };
  
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.getMetrics(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  console.log(data)
  return (
    <FormControl className={classes.margin}>
      <InputLabel id="metric-select-label">Metrics </InputLabel>
      <Select
        multiple
        id="metric-select"
        value={selectedMetrics}
        onChange={handleChange}
        input={<BootstrapInput />}
        renderValue={selected => (
          <div className={classes.chips}>
              {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        >
          {
          metrics
            .map(metric => (
              <MenuItem key={metric} value={metric} >
                {metric}
              </MenuItem> 
          ))}
        </Select>
      </FormControl>
  )
}