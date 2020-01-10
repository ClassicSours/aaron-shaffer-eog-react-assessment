import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  getMetrics: string[];
}

export type Measurement = {
  metric: string;
  at: number;
  value: number;
  unit: string;
}

export type ApiErrorAction = {
  error: string;
}

const initialState = {
  metrics: Array<string>(),
  measurements: new Map<string, Measurement>()
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics:(state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload
      state.metrics = getMetrics;
    },
    measurementDataRecieved:(state, action: PayloadAction<Measurement>) => {
      console.log(action)
      const { metric } = action.payload
      state.measurements.set(metric,action.payload)
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;