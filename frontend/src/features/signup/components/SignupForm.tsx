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
import { normalizeFieldErrors } from '../../../shared/api/errors';

export function SignupForm() {
  const form = useSignupForm();
  const [serverError, setServerError] = useState<string>('');
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const requiredRemaining = getRequiredRemaining(form.value);
  const passwordStatus = usePasswordRules(form.value.password);

  const mergedErrors = {
    ...form.errors,
    ...serverFieldErrors
  };

  const messages = useMemo(
    () => [...new Set([...Object.values(mergedErrors), ...(serverError ? [serverError] : [])])],
    [mergedErrors, serverError]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setSubmitted(true);
    setServerError('');
    setServerFieldErrors({});

    const clientErrors = form.errors;
    if (Object.keys(clientErrors).length > 0) return;

    try {
      const res = await createMember(toCreateMemberRequest(form.value));
      if (res.id) {
        location.href = `/member/${encodeURIComponent(res.id)}/edit`;
      }
    } catch (error) {
      const fieldErrors = normalizeFieldErrors(error);
      if (fieldErrors.length > 0) {
        setServerFieldErrors(
          fieldErrors.reduce<Record<string, string>>((acc, cur) => {
            acc[cur.field] = cur.message;
            return acc;
          }, {})
        );
      } else {
        setServerError('登録に失敗しました。');
      }
    }
  };

  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      <FieldErrorSummary messages={messages} />
      <RequiredRemaining count={requiredRemaining} />
      <PersonalSection bind={form.bind} errors={mergedErrors} />
      <AddressSection bind={form.bind} errors={mergedErrors} />
      <ContactSection bind={form.bind} errors={mergedErrors} />
      <PasswordSection bind={form.bind} status={passwordStatus} errors={mergedErrors} />
      <div className="form-actions"><button className="button button--primary" type="submit">次へ</button></div>
    </form>
  );
}
