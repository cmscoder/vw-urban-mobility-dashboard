import axios, { isAxiosError } from 'axios';

import { getEurostatHttpErrorMessage } from '@/features/vehicles/api/eurostat-http-errors';

const EUROSTAT_BASE_URL =
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0';

export const httpClient = axios.create({
  baseURL: EUROSTAT_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const message = getEurostatHttpErrorMessage(error);
    return Promise.reject(new Error(message, { cause: error }));
  }
);
