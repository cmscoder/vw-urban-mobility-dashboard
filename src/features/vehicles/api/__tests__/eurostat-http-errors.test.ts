import { describe, it, expect } from 'vitest';
import type { AxiosError } from 'axios';
import { getEurostatHttpErrorMessage } from '../eurostat-http-errors';

/** Minimal `AxiosError` shape for message mapping tests. */
function ax(
  partial: Partial<AxiosError> & { response?: AxiosError['response'] }
): AxiosError {
  return partial as AxiosError;
}

describe('getEurostatHttpErrorMessage', () => {
  it('returns timeout copy for ECONNABORTED', () => {
    expect(
      getEurostatHttpErrorMessage(
        ax({ code: 'ECONNABORTED', response: undefined, request: {} })
      )
    ).toBe('Eurostat request timed out. Try again in a moment.');
  });

  it.each([
    [400, 'Invalid request. One or more filters may be wrong.'],
    [404, 'Dataset not found. Check the query parameters.'],
    [429, 'Too many requests to Eurostat. Please wait and try again.'],
  ] as const)('handles HTTP %i', (status, expected) => {
    expect(
      getEurostatHttpErrorMessage(
        ax({ response: { status } as AxiosError['response'] })
      )
    ).toBe(expected);
  });

  it.each([500, 503] as const)('treats %i as server unavailable', (status) => {
    expect(
      getEurostatHttpErrorMessage(
        ax({ response: { status } as AxiosError['response'] })
      )
    ).toBe('Eurostat is temporarily unavailable. Try again later.');
  });

  it('returns generic message for other client errors', () => {
    expect(
      getEurostatHttpErrorMessage(
        ax({ response: { status: 403 } as AxiosError['response'] })
      )
    ).toBe('Eurostat API error (403).');
  });

  it('returns network copy when request was sent but no response', () => {
    expect(
      getEurostatHttpErrorMessage(ax({ response: undefined, request: {} }))
    ).toBe('Could not reach Eurostat. Check your connection.');
  });

  it('returns fallback when there is no request context', () => {
    expect(getEurostatHttpErrorMessage(ax({}))).toBe(
      'Eurostat request failed.'
    );
  });
});
