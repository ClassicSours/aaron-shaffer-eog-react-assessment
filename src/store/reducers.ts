import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as measurementsReducer } from '../Features/Measurements/reducer';
import { reducer as multiplemeasurementsReducer } from '../Features/MultipleMeasurements/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  measurements: measurementsReducer,
  multiplemeasurements: multiplemeasurementsReducer,
};
