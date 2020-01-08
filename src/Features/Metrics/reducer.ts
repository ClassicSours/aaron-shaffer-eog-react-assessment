import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  getMetrics: string[];
}

export type ApiErrorAction = {
  error: string;
}

const initialState = {
  metrics: [''],
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getMetrics:(state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload
      state.metrics = getMetrics;
    },
    metricsApiErrorReceived: (state, actin: PayloadAction<ApiErrorAction>) => state,
  }
})

export const reducer = slice.reducer;
export const actions = slice.actions;