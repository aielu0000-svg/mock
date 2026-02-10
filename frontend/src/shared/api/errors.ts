import { ApiHttpError } from './client';

export type FieldError = { field: string; message: string };

export function normalizeFieldErrors(error: unknown): FieldError[] {
  if (!(error instanceof ApiHttpError)) return [];
  const body = error.body;
  if (!body || typeof body !== 'object') return [];
  const fieldErrors = (body as { fieldErrors?: FieldError[] }).fieldErrors;
  return Array.isArray(fieldErrors) ? fieldErrors : [];
}
