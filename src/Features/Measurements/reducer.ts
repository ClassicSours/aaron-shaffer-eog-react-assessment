import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  ApiErrorAction,
  MEASUREMENT,
  MEASUREMENTS,
  MULTIPLE_MEASUREMENTS,
  MEASUREMENTS_QUERY,
} from '../../resources/types';

interface MeasurementsReducer {
  recentMeasurements: Map<string, MEASUREMENT>;
  measurements: Array<MEASUREMENTS>;
  measurementQuery: Array<MEASUREMENTS_QUERY>;
  units: Map<string, string>;
}

const initialState: MeasurementsReducer = {
  recentMeasurements: new Map<string, MEASUREMENT>(),
  measurements: new Array<MEASUREMENTS>(),
  measurementQuery: new Array<MEASUREMENTS_QUERY>(),
  units: new Map<string, string>(),
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementDataRecieved: (state, action: PayloadAction<MEASUREMENT>) => {
      const { payload } = action;
      const { metric } = payload;
      state.recentMeasurements.set(metric, payload);
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => state,
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
