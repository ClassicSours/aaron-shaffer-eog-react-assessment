import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  ApiErrorAction,
  Measurement,
  MultipleMeasurements,
  Measurements,
  MeasurementQuery,
  Heartbeat,
} from '../../resources/types';

interface MeasurementsReducer {
  heartBeat: number;
  recentMeasurements: Map<string, Measurement>;
  measurements: Array<Measurements>;
  measurementQuery: Array<MeasurementQuery>;
  units: Map<string, string>;
}

const now = new Date();
const initialState: MeasurementsReducer = {
  heartBeat: now.getTime(),
  recentMeasurements: new Map<string, Measurement>(),
  measurements: new Array<Measurements>(),
  measurementQuery: new Array<MeasurementQuery>(),
  units: new Map<string, string>(),
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementDataRecieved: (state, action: PayloadAction<Measurement>) => {
      const { payload } = action;
      const { metric } = payload;
      state.recentMeasurements.set(metric, payload);
    },
    multipleMeasurementsDataReceived: (state, action: PayloadAction<MultipleMeasurements>) => {
      console.log(action);
      const { getMultipleMeasurements } = action.payload;
      state.measurements = getMultipleMeasurements;
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => state,
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
  extraReducers: {
    'metrics/setSelectedMetrics': (state, action: PayloadAction<string[]>) => {
      const { payload } = action;
      state.measurementQuery = payload.map<MeasurementQuery>(metric => {
        return {
          metricName: metric,
          after: state.heartBeat,
        };
      });
    },
    'metrics/setHeartbeat': (state, action: PayloadAction<Heartbeat>) => {
      const { heartBeat } = action.payload;
      state.heartBeat = heartBeat - 1500000;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
