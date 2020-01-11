import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as metricsReducer2 } from '../Features/Subscription/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  metrics2: metricsReducer2
};
