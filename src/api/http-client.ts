import axios from 'axios';

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
    const status = error.response?.status;
    const message =
      status === 404
        ? 'Dataset not found. Check the query parameters.'
        : status === 400
          ? 'Invalid request. One or more filters may be wrong.'
          : `Eurostat API error (${status ?? 'network'})`;

    return Promise.reject(new Error(message));
  }
);
