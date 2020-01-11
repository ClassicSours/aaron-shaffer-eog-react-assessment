import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement } from '../../types';
import { useCallback } from 'react';
type Metrics = {
  getMetrics: string[];
}
const initialState = {
  metrics: Array<string>(),
  measurements: new Map<string, Measurement[]>(),
  selectedMetrics:Array<string>()
}

const slice = createSlice({
  name: 'metrics2',
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
    measurementDataRecieved:(state, action:PayloadAction<Measurement>) => {
      const { payload } = action
      const { metric, at, value, unit } = payload
      console.log(payload)
      if (!state.measurements.get(metric)) {
        state.measurements.set(metric, [payload])
      } else {
        state.measurements.get(metric)!.push(action.payload)
      }
      console.log(state.measurements.get(metric))
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;