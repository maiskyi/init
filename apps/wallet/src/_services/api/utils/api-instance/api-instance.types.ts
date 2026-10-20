export interface ApiInstanceParams {
  data?: unknown;
  headers?: HeadersInit;
  method: 'DELETE' | 'GET' | 'POST' | 'PUT';
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  url: string;
}
