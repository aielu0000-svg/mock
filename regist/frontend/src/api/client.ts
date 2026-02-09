// frontend/src/api/client.ts
import type { ApiError } from "./types"; 

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

type Json = any;

async function safeJson(res: Response): Promise<Json | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export class HttpError extends Error {
  status: number;
  body: ApiError | null;
  constructor(status: number, body: ApiError | null, message?: string) {
    super(message || body?.message || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {})
    }
  });

  if (res.ok) {
    const data = await safeJson(res);
    return data as T;
  }

  const body = (await safeJson(res)) as ApiError | null;
  throw new HttpError(res.status, body);
}
