import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer'
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
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
import Measurements from './Measurements';
import HistoricalChart from './HistoricalChart';

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

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMetrics
}
`;

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
  );
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics, selectedMetrics } = useSelector(getMetrics)
  const [result] = useQuery({
    query
  });
  const { fetching, data, error } = result;

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
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.getMetrics(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
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
          <GridList cellHeight={'auto'} className={classes.gridList} cols={2} spacing={15}>
          {selectedMetrics.map(metric => (
            <GridListTile key={metric} cols={1}>
              <Measurements
                metricName={metric}
                actions={actions}
              />
            </GridListTile>
          ))}
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
        <Grid item xs={12} className={classes.grid}>
          <HistoricalChart 
            actions={actions}
          />
        </Grid>
      </Grid>
    </div>
  )
}