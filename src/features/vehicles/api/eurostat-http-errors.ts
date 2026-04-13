import type { AxiosError } from 'axios';

/** Maps an Axios error from Eurostat into a short user-facing message. */
export function getEurostatHttpErrorMessage(error: AxiosError): string {
  if (error.code === 'ECONNABORTED') {
    return 'Eurostat request timed out. Try again in a moment.';
  }

  const status = error.response?.status;

  if (status != null) {
    switch (status) {
      case 400:
        return 'Invalid request. One or more filters may be wrong.';
      case 404:
        return 'Dataset not found. Check the query parameters.';
      case 429:
        return 'Too many requests to Eurostat. Please wait and try again.';
      default:
        if (status >= 500) {
          return 'Eurostat is temporarily unavailable. Try again later.';
        }
        return `Eurostat API error (${status}).`;
    }
  }

  if (!error.response && error.request) {
    return 'Could not reach Eurostat. Check your connection.';
  }

  return 'Eurostat request failed.';
}
