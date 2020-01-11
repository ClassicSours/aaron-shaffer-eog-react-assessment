import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement, Metrics } from '../../types';

const initialState = {
  // array of metric names
  metrics: Array<string>(),
  // array of currently selected metrics
  selectedMetrics: Array<string>(),
  newMeasurements: new Map<string, Measurement>(),
  measurements: new Map<string, Array<Measurement>>(),
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics: (state, action: PayloadAction<Metrics>) => {
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
    },
    measurementDataRecieved: (state, action: PayloadAction<Measurement>) => {
      const { payload } = action;
      const { metric } = payload;
      state.newMeasurements.set(metric, payload);
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
