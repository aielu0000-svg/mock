import { SignupFormValue } from './uiTypes';

export function validateSignup(v: SignupFormValue) {
  const errors: Record<string, string> = {};
  if (!v.lastNameKanji) errors.lastNameKanji = '姓（漢字）は必須です';
  if (!v.firstNameKanji) errors.firstNameKanji = '名（漢字）は必須です';
  if (!v.email) errors.email = 'メールアドレスは必須です';
  if (v.password && v.passwordConfirm && v.password !== v.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません';
  }
  return errors;
}
