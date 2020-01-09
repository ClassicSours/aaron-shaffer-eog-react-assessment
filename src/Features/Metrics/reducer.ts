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
  lastKnownMeasurement: Array<Measurement>()
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics:(state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload
      state.metrics = getMetrics;
    },
    getLastKnownMeasurement:(state, action:PayloadAction<Measurement>) => {

    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    }
  }
)

export const reducer = slice.reducer;
export const actions = slice.actions;