import { apiFetch } from '../../../shared/api/client';
import { MemberView } from './members.types';

export function getMember(id: string) {
  return apiFetch<MemberView>(`/api/members/${encodeURIComponent(id)}`);
}
