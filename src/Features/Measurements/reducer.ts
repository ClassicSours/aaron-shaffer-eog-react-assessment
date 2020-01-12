import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement, MultipleMeasurements, MeasurementQuery, Heartbeat } from '../../resources/types';

interface MeasurementsReducer {
  heartbeat: number;
  recentMeasurements: Map<string, Measurement>;
  measurements: Map<string, Measurement[]>;
  measurementQuery: Array<MeasurementQuery>;
  multipleMeasurements: MultipleMeasurements;
}

const now = new Date();
const initialState: MeasurementsReducer = {
  heartbeat: now.getTime(),
  recentMeasurements: new Map<string, Measurement>(),
  measurements: new Map<string, Measurement[]>(),
  measurementQuery: new Array<MeasurementQuery>(),
  multipleMeasurements: Object(),
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
    multipleMeasurementsDataReceived: (state, action: any) => {
      console.log(action);
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
          after: state.heartbeat,
        };
      });
    },
    'metrics/setHeartbeat': (state, action: PayloadAction<Heartbeat>) => {
      const { heartbeat } = action.payload;
      state.heartbeat = heartbeat;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
