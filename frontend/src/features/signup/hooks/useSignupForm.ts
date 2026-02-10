import { ChangeEvent, useMemo, useState } from 'react';
import { defaultSignupFormValue } from '../model/defaults';
import { SignupFormValue } from '../model/uiTypes';
import { validateSignup } from '../model/schema';

export function useSignupForm() {
  const [value, setValue] = useState<SignupFormValue>(defaultSignupFormValue);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => (submitted ? validateSignup(value) : {}), [submitted, value]);

  return {
    value,
    errors,
    setSubmitted,
    bind: (key: keyof SignupFormValue) => ({
      value: value[key],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValue((prev) => ({ ...prev, [key]: e.target.value }))
    })
  };
}
