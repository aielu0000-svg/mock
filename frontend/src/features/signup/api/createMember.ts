import { apiFetch } from '../../../shared/api/client';
import { CreateMemberRequest, CreateMemberResponse } from './members.types';

export function createMember(payload: CreateMemberRequest) {
  return apiFetch<CreateMemberResponse>('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
