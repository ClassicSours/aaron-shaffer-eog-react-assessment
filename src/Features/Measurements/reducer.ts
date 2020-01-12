import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction, Measurement, MultipleMeasurements, MeasurementQuery} from '../../resources/types';
import Measurements from './Measurements';

interface MeasurementsReducer {
  measurement: Measurement,
  measurements: Map<string,Measurement>,
  measurementQuery: Array<MeasurementQuery>,
  multipleMeasurements: MultipleMeasurements
}

const initialState:MeasurementsReducer = {
  measurement: Object(),
  measurements: new Map<string,Measurement>(),
  measurementQuery: new Array<MeasurementQuery>(),
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
    },
    removeSelectedMetric: (state, action: PayloadAction<string>) => state,
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
  extraReducers: {
    "metrics/setSelectedMetrics": (state, action: PayloadAction<string[]>) => {
      console.log(state, action)
      const {payload} = action
      const heartbeat = Date.now()
      state.measurementQuery = payload.map<MeasurementQuery>(metric => {
        return {
          metricName: metric,
          before: heartbeat,
          after: heartbeat - 30000
        }
      })
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
