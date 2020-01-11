import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement } from '../../types';
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
    measurementDataRecieved:(state, action:PayloadAction<Measurement>) => {
      console.log(action)
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state
  },
})

export const reducer = slice.reducer;
export const actions = slice.actions;