import type Forecast from '@/model/Forecast';
import http from '@/utils/http';
import type { AxiosRequestConfig } from 'axios';

export const get3DayForecast = async (city: string): Promise<Forecast> => {
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: { q: city, days: '3' }
  };

  return executeForecastRequest(options);
};

export const get3DayForecastByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<Forecast> => {
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: { q: `${latitude},${longitude}`, days: '3' }
  };

  return executeForecastRequest(options);
};

async function executeForecastRequest(options: AxiosRequestConfig) {
  const response = await http.request(options);
  const forecast: Forecast = {
    location: {
      name: response.data.location.name,
      region: response.data.location.region,
      country: response.data.location.country
    },
    forecast: response.data.forecast.forecastday.map((d: any) => ({
      date: new Date(d.date_epoch * 1000),
      weekDay: new Date(d.date_epoch * 1000).toLocaleDateString('es', {
        weekday: 'long'
      }),
      temperature: d.day.avgtemp_c,
      wind: d.day.maxwind_kph,
      humidity: d.day.avghumidity,
      conditionIcon: d.day.condition.icon
    }))
  };

  return forecast;
}
