import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  ApiErrorAction,
  Metrics,
  MULTIPLE_MEASUREMENTS,
  MEASUREMENTS_QUERY,
  MEASUREMENT,
  Heartbeat,
  MEASUREMENTS,
} from '../../resources/types';

interface MetricsInterface {
  heartBeat: number;
  metrics: Array<string>;
  selectedMetrics: Array<string>;

  measurementQuery: Array<MEASUREMENTS_QUERY>;
  measurements: Map<string, MEASUREMENTS>;

  recentMeasurements: Map<string, MEASUREMENT>;
}

const initialState: MetricsInterface = {
  // milliseoncs since epoch, since application started
  heartBeat: -1,
  // drop down values
  metrics: new Array<string>(),
  // select values
  selectedMetrics: new Array<string>(),
  // query generated from selected metrics
  measurementQuery: new Array<MEASUREMENTS_QUERY>(),
  // data for chart
  measurements: new Map<string, MEASUREMENTS>(),
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
      if (payload.length === 0) {
        state.selectedMetrics.forEach(metric => {
          state.measurements.delete(metric);
        });
      }
      state.selectedMetrics = payload;
      const now = new Date();
      const n_seconds_ago = now.getTime() - 20000;
      if (state.heartBeat === -1 || state.heartBeat < n_seconds_ago) {
        state.heartBeat = n_seconds_ago;
      }
      state.measurementQuery = payload.map<MEASUREMENTS_QUERY>(metric => {
        return {
          metricName: metric,
          after: state.heartBeat,
        };
      });
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => {
      let { payload } = action;
      state.selectedMetrics = state.selectedMetrics.filter(metric => metric !== payload);
      state.measurements.delete(payload);
      state.measurementQuery = state.measurementQuery.filter(mq => mq.metricName !== payload);
    },
    measurementDataRecieved: (state, action: PayloadAction<MEASUREMENT>) => {
      const { payload } = action;
      const { metric } = payload;
      state.recentMeasurements.set(metric, payload);
      if (state.selectedMetrics.includes(metric)) {
        const old_measurements = state.measurements.get(metric);
        if (!old_measurements) {
          const new_measurements: MEASUREMENTS = {
            metric: metric,
            measurements: [payload],
            __typename: 'MEASUREMENTS',
          };
          state.measurements.set(metric, new_measurements);
        } else {
          old_measurements.measurements.push(payload);
          if (old_measurements.measurements.length >= 30)
            old_measurements.measurements = old_measurements.measurements.slice(1).slice(-30);
          state.measurements.set(metric, old_measurements);
        }
      }
    },
    setHeartbeat: (state, action: PayloadAction<Heartbeat>) => {
      const { heartBeat } = action.payload;
      state.heartBeat = heartBeat;
    },
    multipleMeasurementsDataReceived: (state, action: PayloadAction<MULTIPLE_MEASUREMENTS>) => {
      const { getMultipleMeasurements } = action.payload;
      const multiple_new_measurements: MEASUREMENTS[] = getMultipleMeasurements;
      multiple_new_measurements.forEach(new_measurements => {
        const { metric } = new_measurements;
        const old_measurements = state.measurements.get(metric);
        if (!old_measurements) {
          if (new_measurements.measurements.length > 30) new_measurements.measurements.slice(1).slice(-30);
          state.measurements.set(metric, new_measurements);
        } else {
          const { measurements } = new_measurements;
          old_measurements.measurements.push(...measurements);
          const uniq = old_measurements.measurements
            .sort((a, b) => {
              return a.at - b.at;
            })
            .filter(function(item, pos, ary) {
              return !pos || item !== ary[pos - 1];
            });
          old_measurements.measurements = uniq;
          if (old_measurements.measurements.length > 30) old_measurements.measurements.slice(1).slice(-30);
          state.measurements.set(metric, old_measurements);
        }
      });
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});
export const reducer = slice.reducer;
export const actions = slice.actions;
