import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { defaultSignupFormValue } from '../model/defaults';
import { SignupFormValue } from '../model/uiTypes';
import { validateSignup } from '../model/schema';

const PREFILL_KEY = (window as Window & { SIGNUP_PREFILL_KEY?: string }).SIGNUP_PREFILL_KEY ?? 'signupPrefill';

export function useSignupForm() {
  const [value, setValue] = useState<SignupFormValue>(defaultSignupFormValue);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => (submitted ? validateSignup(value) : {}), [submitted, value]);

  useEffect(() => {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return;

    try {
      const prefill = JSON.parse(raw) as Record<string, string>;
      setValue((prev) => ({
        ...prev,
        lastNameKanji: prefill.lastNameKanji ?? prev.lastNameKanji,
        firstNameKanji: prefill.firstNameKanji ?? prev.firstNameKanji,
        lastNameKana: prefill.lastNameKana ?? prev.lastNameKana,
        firstNameKana: prefill.firstNameKana ?? prev.firstNameKana,
        gender: prefill.gender ?? prev.gender,
        email: prefill.email ?? prev.email,
        zip1: prefill.zip1 ?? prev.zip1,
        zip2: prefill.zip2 ?? prev.zip2,
        prefecture: prefill.prefecture ?? prev.prefecture,
        addressLine1: prefill.addressLine1 ?? prev.addressLine1,
        addressLine2: prefill.addressLine2 ?? prev.addressLine2,
        tel1: prefill.tel1 ?? prev.tel1,
        tel2: prefill.tel2 ?? prev.tel2,
        tel3: prefill.tel3 ?? prev.tel3
      }));

      if (prefill.birthdate?.includes('-')) {
        const [y, m, d] = prefill.birthdate.split('-');
        setValue((prev) => ({ ...prev, birthYear: y || prev.birthYear, birthMonth: m || prev.birthMonth, birthDay: d || prev.birthDay }));
      }
    } catch {
      // no-op
    }
  }, []);

  return {
    value,
    errors,
    setSubmitted,
    setValue,
    bind: (key: keyof SignupFormValue) => ({
      value: value[key],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValue((prev) => ({ ...prev, [key]: e.target.value }))
    })
  };
}
