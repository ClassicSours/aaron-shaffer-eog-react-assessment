import { createSlice, PayloadAction } from 'redux-starter-kit';
import {slice as measurements} from '../Measurements/reducer'

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
  measurements: [] as Measurement[]
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
      const { metric, at, value, unit } = action.payload
      // console.log(measurements[metric])
      // state.metric = metric;
      // state.at = at;
      // state.value = value;
      // state.unit = unit;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;