import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement, MultipleMeasurements} from '../../resources/types';
import Measurements from './Measurements';

interface MeasurementsReducer {
  measurement: Measurement,
  measurements: Map<string,Measurement>,
  selectedMeasurements: Map<string,Measurement>,
  multipleMeasurements: MultipleMeasurements
}

const initialState:MeasurementsReducer = {
  measurement: Object(),
  measurements: new Map<string,Measurement>(),
  selectedMeasurements: new Map<string,Measurement>(),
  multipleMeasurements: Object()
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementDataRecieved: (state, action: PayloadAction<Measurement>) => {
      const { payload } = action;
      const {metric} = payload
      state.measurement = payload;
      state.measurements.set(metric,payload)
      if(state.selectedMeasurements.get(metric)) {
        state.selectedMeasurements.set(metric,payload)
      }
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => state,
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
  extraReducers: {
    "metrics/setSelectedMetrics": (state, action: PayloadAction<string[]>) => {
      console.log(state, action)
      const {payload} = action
      // state.selectedMeasurements = state.measurements.filter(measurement => payload.includes(measurement.metric))
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
