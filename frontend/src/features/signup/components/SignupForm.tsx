import { FormEvent, useMemo, useState } from 'react';
import { createMember } from '../api/createMember';
import { toCreateMemberRequest } from '../api/members.mappers';
import { usePasswordRules } from '../hooks/usePasswordRules';
import { getRequiredRemaining } from '../hooks/useRequiredRemaining';
import { useSignupForm } from '../hooks/useSignupForm';
import { AddressSection } from './sections/AddressSection';
import { ContactSection } from './sections/ContactSection';
import { PasswordSection } from './sections/PasswordSection';
import { PersonalSection } from './sections/PersonalSection';
import { FieldErrorSummary } from './parts/FieldErrorSummary';
import { RequiredRemaining } from './parts/RequiredRemaining';

export function SignupForm() {
  const form = useSignupForm();
  const [serverError, setServerError] = useState<string>('');
  const requiredRemaining = getRequiredRemaining(form.value);
  const passwordStatus = usePasswordRules(form.value.password);
  const messages = useMemo(() => [...Object.values(form.errors), ...(serverError ? [serverError] : [])], [form.errors, serverError]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setSubmitted(true);
    if (Object.keys(form.errors).length > 0) return;
    setServerError('');
    try {
      const res = await createMember(toCreateMemberRequest(form.value));
      if (res.id) {
        location.href = `/member/${encodeURIComponent(res.id)}/edit`;
      }
    } catch {
      setServerError('登録に失敗しました。');
    }
  };

  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      <FieldErrorSummary messages={messages} />
      <RequiredRemaining count={requiredRemaining} />
      <PersonalSection bind={form.bind} errors={form.errors} />
      <AddressSection bind={form.bind} />
      <ContactSection bind={form.bind} />
      <PasswordSection bind={form.bind} status={passwordStatus} />
      <div className="form-actions"><button className="button button--primary" type="submit">次へ</button></div>
    </form>
  );
}
