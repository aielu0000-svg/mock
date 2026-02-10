import { SignupFormValue } from './uiTypes';

export function validateSignup(v: SignupFormValue) {
  const errors: Partial<Record<keyof SignupFormValue, string>> = {};

  if (v.password && v.passwordConfirm && v.password !== v.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません';
  }

  return errors;
}
