import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  ApiErrorAction,
  Metrics,
  MULTIPLE_MEASUREMENTS,
  MEASUREMENTS_QUERY,
  MEASUREMENT,
  MEASUREMENTS,
  Heartbeat,
} from '../../resources/types';

const now = new Date();

interface MetricsInterface {
  heartBeat: number;
  metrics: Array<string>;
  selectedMetrics: Array<string>;

  measurementQuery: Array<MEASUREMENTS_QUERY>;
  measurements: Array<MEASUREMENT>;

  recentMeasurements: Map<string, MEASUREMENT>;
}

const initialState: MetricsInterface = {
  // milliseoncs since epoch, since application started
  heartBeat: now.getTime(),
  // drop down values
  metrics: new Array<string>(),
  // select values
  selectedMetrics: new Array<string>(),
  // query generated from selected metrics
  measurementQuery: new Array<MEASUREMENTS_QUERY>(),
  // data for chart
  measurements: new Array<MEASUREMENT>(),
  // most recent measurement data as a map O(1)?
  recentMeasurements: new Map<string, MEASUREMENT>(),
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload;
      state.metrics = getMetrics;
    },
    setSelectedMetrics: (state, action: PayloadAction<Array<string>>) => {
      const { payload } = action;
      state.selectedMetrics = payload;
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => {
      let { payload } = action;
      state.selectedMetrics = state.selectedMetrics.filter(metric => metric !== payload);
      state.measurements = state.measurements.filter(measurement => measurement.metric !== payload);
    },
    measurementDataRecieved: (state, action: PayloadAction<MEASUREMENT>) => {
      const { payload } = action;
      const { metric } = payload;
      state.recentMeasurements.set(metric, payload);
      state.measurements.push(payload);
    },
    setHeartbeat: (state, action: PayloadAction<Heartbeat>) => {
      const { heartBeat } = action.payload;
      state.heartBeat = heartBeat;
    },
    multipleMeasurementsDataReceived: (state, action: PayloadAction<MULTIPLE_MEASUREMENTS>) => {
      const { getMultipleMeasurements } = action.payload;
      getMultipleMeasurements.forEach(multipleMeasurements => {
        state.measurements.concat([...multipleMeasurements.measurements]);
      });
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
