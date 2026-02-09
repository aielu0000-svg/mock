// frontend/src/api/errors.ts
import type { FieldErrorItem } from "./types";

export function toFieldErrorMap(items?: FieldErrorItem[]): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(items)) return out;
  for (const it of items) {
    const field = (it?.field ?? "").toString();
    const msg = (it?.message ?? "").toString();
    if (!field) continue;
    out[field] = msg || out[field] || "入力内容を確認してください。";
  }
  return out;
}
