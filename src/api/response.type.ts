export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type ApiError =
  | { kind: 'network' }
  | { kind: 'http'; status: number; message?: string }
  | { kind: 'unknown' };
