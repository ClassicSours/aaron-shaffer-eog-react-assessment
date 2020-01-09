import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  getLastKnownMeasurement: {
    metric: string;
    at: number;
    value: number;
    unit: string;
  }
}

export type ApiErrorAction = {
  error: string;
}

const initialState = {
  metric: '',
  at: 0,
  value: 0,
  unit: ''
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getLastKnownMeasurement:(state, action: PayloadAction<Measurement>) => {
      const { getLastKnownMeasurement } = action.payload
      state.metric = getLastKnownMeasurement.metric;
      state.at = getLastKnownMeasurement.at;
      state.value = getLastKnownMeasurement.value;
      state.unit = getLastKnownMeasurement.unit;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state}
  }
)

export const reducer = slice.reducer;
export const actions = slice.actions;