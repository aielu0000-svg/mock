import { FormEvent, useMemo, useState } from 'react';
import { createMember } from '../api/createMember';
import { toCreateMemberRequest } from '../api/members.mappers';
import { usePasswordRules } from '../hooks/usePasswordRules';
import { getRequiredRemaining } from '../hooks/useRequiredRemaining';
import { useSignupForm } from '../hooks/useSignupForm';
import { AddressSection } from './sections/AddressSection';
import { ContactSection } from './sections/ContactSection';
import { ConsentSection } from './sections/ConsentSection';
import { PasswordSection } from './sections/PasswordSection';
import { PersonalSection } from './sections/PersonalSection';
import { FieldErrorSummary } from './parts/FieldErrorSummary';
import { RequiredRemaining } from './parts/RequiredRemaining';
import { normalizeFieldErrors } from '../../../shared/api/errors';
import { SignupFormValue } from '../model/uiTypes';
import { Button } from '../../../shared/components/ui/button';

const REQUIRED_MESSAGES: Partial<Record<keyof SignupFormValue, string>> = {
  lastNameKanji: '姓を入力してください。',
  firstNameKanji: '名を入力してください。',
  lastNameKana: 'セイを入力してください。',
  firstNameKana: 'メイを入力してください。',
  birthYear: '生年（西暦）を入力してください。',
  birthMonth: '生月を選択してください。',
  birthDay: '生日を選択してください。',
  gender: '性別を選択してください。',
  email: 'メールアドレスを入力してください。',
  zip1: '郵便番号（上3桁）を入力してください。',
  zip2: '郵便番号（下4桁）を入力してください。',
  prefecture: '都道府県を選択してください。',
  addressLine1: '市区町村・番地を入力してください。',
  tel1: '電話番号（市外局番）を入力してください。',
  tel2: '電話番号（市内局番）を入力してください。',
  tel3: '電話番号（番号）を入力してください。',
  newsletter: 'お知らせメールの受け取り有無を選択してください。',
  password: 'パスワードを入力してください。',
  passwordConfirm: 'パスワード確認用を入力してください。'
};

const REQUIRED_KEYS: (keyof SignupFormValue)[] = [
  'lastNameKanji', 'firstNameKanji', 'lastNameKana', 'firstNameKana',
  'birthYear', 'birthMonth', 'birthDay', 'gender', 'email',
  'zip1', 'zip2', 'prefecture', 'addressLine1',
  'tel1', 'tel2', 'tel3', 'newsletter', 'password', 'passwordConfirm'
];

function getRequiredErrors(value: SignupFormValue) {
  return REQUIRED_KEYS.reduce<Record<string, string>>((acc, key) => {
    if (!String(value[key] ?? '').trim()) {
      acc[key] = REQUIRED_MESSAGES[key] ?? '必須項目です。';
    }
    return acc;
  }, {});
}

export function SignupForm() {
  const form = useSignupForm();
  const [serverError, setServerError] = useState<string>('');
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const requiredRemaining = getRequiredRemaining(form.value);
  const passwordStatus = usePasswordRules(form.value.password);
  const lockCheckKeys: (keyof SignupFormValue)[] = [
    'lastNameKanji', 'firstNameKanji', 'lastNameKana', 'firstNameKana',
    'birthYear', 'birthMonth', 'birthDay', 'gender', 'email',
    'zip1', 'zip2', 'prefecture', 'addressLine1', 'addressLine2', 'tel1', 'tel2', 'tel3'
  ];
  const hasLockedFields = lockCheckKeys.some((k) => form.isLocked(k));

  const requiredErrors = useMemo(() => (form.submitted ? getRequiredErrors(form.value) : {}), [form.submitted, form.value]);

  const mergedErrors = {
    ...requiredErrors,
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

    const submitRequiredErrors = getRequiredErrors(form.value);
    if (Object.keys(submitRequiredErrors).length > 0 || Object.keys(form.errors).length > 0) {
      return;
    }

    try {
      const res = await createMember(toCreateMemberRequest(form.value));
      if (res.id) {
        alert('登録しました');
        location.href = `/member/${encodeURIComponent(res.id)}/edit`;
      }
    } catch (error) {
      const fieldErrors = normalizeFieldErrors(error);
      const popupMessages: string[] = [];

      if (fieldErrors.length > 0) {
        setServerFieldErrors(
          fieldErrors.reduce<Record<string, string>>((acc, cur) => {
            acc[cur.field] = cur.message;
            popupMessages.push(`${cur.field}: ${cur.message}`);
            return acc;
          }, {})
        );
      } else {
        setServerError('登録に失敗しました。');
        popupMessages.push('登録に失敗しました。');
      }

      alert(popupMessages.join('\n'));
    }
  };

  return (
    <form className="signup-form" id="signupForm" onSubmit={onSubmit} noValidate>
      <FieldErrorSummary messages={messages} />
      <RequiredRemaining count={requiredRemaining} />
      {hasLockedFields && <p className="help-text">※編集画面から戻ったため、基本情報の一部は固定表示です。</p>}
      <PersonalSection bind={form.bind} errors={mergedErrors} />
      <AddressSection bind={form.bind} errors={mergedErrors} />
      <ContactSection bind={form.bind} errors={mergedErrors} />
      <ConsentSection />
      <PasswordSection
        bind={form.bind}
        status={passwordStatus}
        errors={mergedErrors}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((prev) => !prev)}
        submitted={form.submitted}
      />
      <div className="form-actions"><Button className="button button--primary" type="submit" id="next" size="lg">登録</Button></div>
    </form>
  );
}
