import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  ApiErrorAction,
  Heartbeat,
  MULTIPLE_MEASUREMENTS,
  MEASUREMENTS_QUERY,
  MEASUREMENT,
  MEASUREMENTS,
} from '../../resources/types';

const now = new Date();

const initialState = {
  heartBeat: now.getTime(),
  measurementQuery: new Array<MEASUREMENTS_QUERY>(),
  data: new Array<MEASUREMENT>(),
};

const slice = createSlice({
  name: 'multiplemeasurements',
  initialState,
  reducers: {
    multipleMeasurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    setHeartbeat: (state, action: PayloadAction<Heartbeat>) => {
      const { heartBeat } = action.payload;
      state.heartBeat = heartBeat;
    },
    multipleMeasurementsDataReceived: (state, action: PayloadAction<MULTIPLE_MEASUREMENTS>) => {
      const { getMultipleMeasurements } = action.payload;
      console.log(getMultipleMeasurements);

      const measurements = getMultipleMeasurements.map(measurements => {
        return measurements as MEASUREMENTS;
      });
      // state.data = measurements.map(m => {
      //   return m.measurements;
      // });
      console.log(state.data);
    },
  },
  extraReducers: {
    'metrics/setSelectedMetrics': (state, action: PayloadAction<string[]>) => {
      const { payload } = action;
      state.measurementQuery = payload.map<MEASUREMENTS_QUERY>(metric => {
        return {
          metricName: metric,
          after: state.heartBeat,
        };
      });
    },
    'metrics/setHeartbeat': (state, action: PayloadAction<Heartbeat>) => {
      const { heartBeat } = action.payload;
      state.heartBeat = heartBeat;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
