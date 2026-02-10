import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { defaultSignupFormValue } from '../model/defaults';
import { SignupFormValue } from '../model/uiTypes';
import { validateSignup } from '../model/schema';

const PREFILL_KEY = (window as Window & { SIGNUP_PREFILL_KEY?: string }).SIGNUP_PREFILL_KEY ?? 'signupPrefill';

export function useSignupForm() {
  const [value, setValue] = useState<SignupFormValue>(defaultSignupFormValue);
  const [submitted, setSubmitted] = useState(false);
  const [lockedKeys, setLockedKeys] = useState<Set<keyof SignupFormValue>>(new Set());
  const errors = useMemo(() => (submitted ? validateSignup(value) : {}), [submitted, value]);

  useEffect(() => {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return;

    try {
      const prefill = JSON.parse(raw) as Record<string, string>;
      const nextLocked = new Set<keyof SignupFormValue>();
      const mark = (key: keyof SignupFormValue, value?: string) => {
        if (value != null && String(value).trim() !== '') nextLocked.add(key);
      };

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

      mark('lastNameKanji', prefill.lastNameKanji);
      mark('firstNameKanji', prefill.firstNameKanji);
      mark('lastNameKana', prefill.lastNameKana);
      mark('firstNameKana', prefill.firstNameKana);
      mark('gender', prefill.gender);
      mark('email', prefill.email);
      mark('zip1', prefill.zip1);
      mark('zip2', prefill.zip2);
      mark('prefecture', prefill.prefecture);
      mark('addressLine1', prefill.addressLine1);
      mark('addressLine2', prefill.addressLine2);
      mark('tel1', prefill.tel1);
      mark('tel2', prefill.tel2);
      mark('tel3', prefill.tel3);

      if (prefill.birthdate?.includes('-')) {
        const [y, m, d] = prefill.birthdate.split('-');
        setValue((prev) => ({ ...prev, birthYear: y || prev.birthYear, birthMonth: m || prev.birthMonth, birthDay: d || prev.birthDay }));
        mark('birthYear', y);
        mark('birthMonth', m);
        mark('birthDay', d);
      }

      setLockedKeys(nextLocked);
      sessionStorage.removeItem(PREFILL_KEY);
    } catch {
      // no-op
    }
  }, []);

  return {
    value,
    errors,
    submitted,
    setSubmitted,
    setValue,
    isLocked: (key: keyof SignupFormValue) => lockedKeys.has(key),
    bind: (key: keyof SignupFormValue) => ({
      value: value[key],
      disabled: lockedKeys.has(key),
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValue((prev) => ({ ...prev, [key]: e.target.value }))
    })
  };
}
