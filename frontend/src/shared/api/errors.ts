export type FieldError = { field: string; message: string };

export function normalizeFieldErrors(error: unknown): FieldError[] {
  if (!error || typeof error !== 'object') return [];
  const fieldErrors = (error as { fieldErrors?: FieldError[] }).fieldErrors;
  return Array.isArray(fieldErrors) ? fieldErrors : [];
}
