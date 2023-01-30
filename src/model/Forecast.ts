import type ForecastDay from './ForecastDay';
import type Location from './Location';

export default interface Forecast {
  location: Location;
  forecast: ForecastDay[];
}
