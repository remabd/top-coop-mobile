import { create, isAxiosError } from 'axios';
import { ApiResult } from './response.type';

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

function extractMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  return undefined;
}

export async function request<T>(
  call: Promise<{ data: T }>
): Promise<ApiResult<T>> {
  try {
    const { data } = await call;
    return { ok: true, data };
  } catch (e) {
    if (isAxiosError(e)) {
      return e.response
        ? {
            ok: false,
            error: {
              kind: 'http',
              status: e.response.status,
              message: extractMessage(e.response.data),
            },
          }
        : { ok: false, error: { kind: 'network' } };
    }
    return { ok: false, error: { kind: 'unknown' } };
  }
}
