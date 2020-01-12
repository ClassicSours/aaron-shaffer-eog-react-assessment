import React, { useEffect, useState } from 'react';
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
import { heartBeat, getMultipleMeasurements } from '../../resources/queries';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <MultipleMeasurements />
    </Provider>
  );
};

const getState = (state: IState) => {
  return {
    ...state.multiplemeasurements,
  };
};
const MultipleMeasurements = () => {
  const dispatch = useDispatch();

  const { data, measurementQuery } = useSelector(getState);
  const [heartbeat] = useQuery({ query: heartBeat });

  useEffect(() => {
    console.log('here 1');

    if (heartbeat.error) {
      dispatch(actions.multipleMeasurementsApiErrorReceived({ error: heartbeat.error.message }));
      return;
    }
    if (!heartbeat.data) return;
    dispatch(actions.setHeartbeat(heartbeat.data));
  }, [dispatch, heartbeat.error, heartbeat.data]);

  const [multipleMeasurements, executeQuery] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      input: measurementQuery,
    },
  });
  const [state, setState] = useState();

  useEffect(() => {
    console.log('here 2');
    if (multipleMeasurements.error) {
      dispatch(actions.multipleMeasurementsApiErrorReceived({ error: multipleMeasurements.error.message }));
      return;
    }
    if (!multipleMeasurements.data) return;
    dispatch(actions.multipleMeasurementsDataReceived(multipleMeasurements.data));
    setState(multipleMeasurements.data);
  }, [dispatch, multipleMeasurements.error, multipleMeasurements.data]);

  return null;
};
