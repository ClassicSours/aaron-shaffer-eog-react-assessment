import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, createClient } from 'urql';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { actions } from './reducer';
import { IState } from '../../store';
import { getMultipleMeasurements } from '../../resources/queries';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
import { isSelectionNode } from 'graphql';
const useStyles = makeStyles((theme: Theme) => createStyles({}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <Measurements />
    </Provider>
  );
};

const getState = (state: IState) => {
  return {
    ...state.measurements,
  };
};

const Measurements = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { measurementQuery, measurements } = useSelector(getState);

  const [result, executeQuery] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      input: measurementQuery,
    },
    requestPolicy: 'cache-only',
  });

  useEffect(() => {
    const requestPolicy = measurementQuery.length === 0 ? 'cache-only' : 'cache-and-network';
    executeQuery({ requestPolicy });
  }, [executeQuery, measurementQuery]);

  const { error, data } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.multipleMeasurementsDataReceived(data));
  }, [dispatch, data, error]);
  const [d] = measurements.map(m => {
    return m.measurements;
  });
  return (
    <LineChart width={1000} height={500} data={d}>
      <XAxis height={40} dataKey="at" tick={{ fontSize: 10 }}>
        <Label value="at" position="insideBottom" fontSize={14} fill="#676767" />
      </XAxis>
      {measurements.map(c => {
        console.log(c);
        return (
          <YAxis width={80} yAxisId={c.measurements[0].unit} tick={{ fontSize: 10 }}>
            <Label value={c.measurements[0].unit} angle={-90} position="insideTopLeft" fill="#676767" fontSize={12} />
          </YAxis>
        );
      })}
      {measurements.map(c => {
        return <Line yAxisId={c.measurements[0].unit} type="monotone" dataKey="value" stroke="black" />;
      })}
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    </LineChart>
  );
};
