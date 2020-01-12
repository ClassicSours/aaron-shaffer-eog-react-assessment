import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Metrics, MeasurementQuery } from '../../resources/types';

const initialState = {
  // array of metric names
  metrics: Array<string>(),
  selectedMetrics: Array<string>(),
  measurementQuery: Array<MeasurementQuery>()
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
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
  extraReducers: {
    "measurements/removeSelectedMetric": (state, action: PayloadAction<string>) => {
      let { payload } = action;
      state.selectedMetrics = state.selectedMetrics.filter(metric => metric !== payload);
    },
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
