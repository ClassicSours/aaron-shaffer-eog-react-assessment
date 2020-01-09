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
import {Paper, Grid, GridList, GridListTile, InputAdornment, IconButton} from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import CloseIcon from '@material-ui/icons/Close';

import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Measurements from '../Measurements/Measurements';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    gridList: {
      height: "100%",
      width: "100%",
    },
    formControl: {
      margin: theme.spacing(1),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    select: {
      width: "500px"
    },
    iconButton: {
      "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: "transparent"
    }
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
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics)
  const [result] = useQuery({
    query
  });

  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([]);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMetrics(event.target.value as string[]);
  };

  const handleClickMetric = (event: React.MouseEvent) => {
    console.log(event.target)
  }

  const handleClear = () => {
    setSelectedMetrics([])
  }

  const handleDelete = (value: string) => {
    setSelectedMetrics(selectedMetrics.filter(metric => metric !== value) as string[])
  }
  
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.getMetrics(data));
  }, [dispatch, data, error, selectedMetrics]);

  if (fetching) return <LinearProgress />;
  
  console.log(data)
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
        alignContent="flex-start"
      >
        <Grid item xs={8}>
          <GridList cellHeight={100} className={classes.gridList} cols={3}>
          {selectedMetrics.map(metric => (
            <GridListTile key={metric} cols={1}>
              <Measurements
                metricName={metric}
              />
            </GridListTile>
          ))}
          </GridList>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
          <InputLabel id="metric-select-label">Metrics </InputLabel>
          <Select
            multiple
            id="metric-select"
            value={selectedMetrics}
            onChange={handleChange}
            variant="outlined"
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
                  {`No Options`}
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
      </Grid>
    </div>
  )
}