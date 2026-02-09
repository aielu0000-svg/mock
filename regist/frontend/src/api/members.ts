// frontend/src/api/members.ts
import { apiFetch } from "./client";
import type { CreateMemberResponse, MemberDto } from "./types";

export type CreateMemberRequest = {
  name: {
    lastKanji: string;
    firstKanji: string;
    lastKana: string;
    firstKana: string;
  };
  birthDate: { year: string; month: string; day: string };
  gender: string;
  email: string;
  address: {
    zip1: string;
    zip2: string;
    prefecture: string;
    line1: string;
    line2: string;
  };
  phone: { tel1: string; tel2: string; tel3: string };
  newsletter: string;
  password: string;
  passwordConfirm: string;
};

export function createMember(body: CreateMemberRequest) {
  return apiFetch<CreateMemberResponse>("/api/members", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function getMember(id: string) {
  return apiFetch<MemberDto>(`/api/members/${encodeURIComponent(id)}`, {
    method: "GET"
  });
}
