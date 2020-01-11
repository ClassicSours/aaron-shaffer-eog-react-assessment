import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement } from '../../types';

type Metrics = {
  getMetrics: string[];
}

const initialState = {
  metrics: Array<string>(),
  measurements: new Map<string, Measurement>(),
  selectedMetrics: Array<string>()
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics:(state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload
      state.metrics = getMetrics
    },
    setSelectedMetrics:(state, action: PayloadAction<Array<string>>) => {
      const { payload } = action
      state.selectedMetrics = payload
    },
    removeSelectedMetric:(state, action: PayloadAction<string>) => {
      let { payload } = action
      state.selectedMetrics = state.selectedMetrics.filter(metric => metric !== payload) 
    },
    measurementDataRecieved:(state, action: PayloadAction<Measurement>) => {
      const { metric } = action.payload
      state.measurements.set(metric,action.payload)
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;