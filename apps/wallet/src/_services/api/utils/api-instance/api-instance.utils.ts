import { stringify } from 'qs';

import { Api } from '../../services/api';
import { type ApiInstanceParams } from './api-instance.types';

const getData = async <T>(context: Request | Response): Promise<T> => {
  const contentType = context.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await context.json();
  }

  if (contentType && contentType.includes('application/pdf')) {
    return (await context.blob()) as unknown as T;
  }

  return (await context.text()) as unknown as T;
};

const getError = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiInstance = async <T>(
  {
    data: initialBody,
    headers,
    method,
    params,
    signal,
    url: path,
  }: ApiInstanceParams,
  init?: RequestInit,
): Promise<T> => {
  const search = stringify(params, {
    addQueryPrefix: true,
    encodeValuesOnly: true,
    sort: (a, b) => a.localeCompare(b),
  });

  const url = `${Api.baseUrl}${path}${search}`;

  const body = initialBody ? JSON.stringify(initialBody) : null;

  const request = new Request(url, {
    body,
    headers,
    method,
    signal,
  });

  const response = await fetch(request, init);

  if (!response.ok) {
    const error = await getError(response);
    return Promise.reject(error);
  }

  const result = await getData<T>(response);

  return result;
};
