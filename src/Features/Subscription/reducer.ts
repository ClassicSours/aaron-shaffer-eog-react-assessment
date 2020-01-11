import React from 'react';
import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement, Metrics } from '../../types';

const initialState = {
  metrics: Array<string>(),
  selectedMetrics:Array<string>(),

  selectedMeasurements: Array<Measurement>(),

  newMeasurements: new Map<string, Measurement>(),
  measurements: new Map<string, Array<Measurement>>(),
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
      const { metric } = payload
      // state.measurements.set(metric, [...state.recentMeasurements.get(metric),payload])
      console.log(state.measurements)
      state.newMeasurements.set(metric,payload)
      console.log(state.newMeasurements.get(metric))
      // const [measurements] = state.measurements.get(metric)
      // state.measurements.set(metric,[...state.measurements,payload])
      console.log(state.selectedMeasurements)
      // state.recentMeasurements.add(payload)
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;