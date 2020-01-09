import { createSlice, PayloadAction } from 'redux-starter-kit';

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
  metric: '',
  at: 0,
  value: 0,
  unit: ''
}

export const slice = createSlice(
  {
    name: `measurements`,
    initialState,
    reducers: {
    measurementDataRecieved:(state, action: PayloadAction<Measurement>) => {
      console.log(action)
      const { metric, at, value, unit } = action.payload
      state.metric = metric;
      state.at = at;
      state.value = value;
      state.unit = unit;
    },
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state},
  },
)

export const reducer = slice.reducer;
export const actions = slice.actions;