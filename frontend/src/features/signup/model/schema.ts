import { SignupFormValue } from './uiTypes';

export function validateSignup(v: SignupFormValue) {
  const errors: Partial<Record<keyof SignupFormValue, string>> = {};

  if (!v.lastNameKanji) errors.lastNameKanji = '姓（漢字）は必須です';
  if (!v.firstNameKanji) errors.firstNameKanji = '名（漢字）は必須です';
  if (!v.lastNameKana) errors.lastNameKana = '姓（カナ）は必須です';
  if (!v.firstNameKana) errors.firstNameKana = '名（カナ）は必須です';

  if (!v.birthYear) {
    errors.birthYear = '生年月日（年）は必須です';
  } else if (!/^\d{4}$/.test(v.birthYear)) {
    errors.birthYear = '年は4桁の数字で入力してください';
  }

  if (!v.birthMonth) errors.birthMonth = '生年月日（月）は必須です';
  if (!v.birthDay) errors.birthDay = '生年月日（日）は必須です';

  if (!v.gender) errors.gender = '性別は必須です';

  if (!v.email) {
    errors.email = 'メールアドレスは必須です';
  } else if (!v.email.includes('@')) {
    errors.email = 'メールアドレスの形式が不正です';
  }

  if (!v.zip1) {
    errors.zip1 = '郵便番号（前半）は必須です';
  } else if (!/^\d{3}$/.test(v.zip1)) {
    errors.zip1 = '郵便番号（前半）は3桁の数字で入力してください';
  }

  if (!v.zip2) {
    errors.zip2 = '郵便番号（後半）は必須です';
  } else if (!/^\d{4}$/.test(v.zip2)) {
    errors.zip2 = '郵便番号（後半）は4桁の数字で入力してください';
  }

  if (!v.prefecture) errors.prefecture = '都道府県は必須です';
  if (!v.addressLine1) errors.addressLine1 = '市区町村・番地は必須です';

  if (!v.tel1) errors.tel1 = '電話番号（1）は必須です';
  if (!v.tel2) errors.tel2 = '電話番号（2）は必須です';
  if (!v.tel3) errors.tel3 = '電話番号（3）は必須です';

  if (!v.newsletter) errors.newsletter = 'お知らせメールの選択は必須です';
  if (!v.password) errors.password = 'パスワードは必須です';
  if (!v.passwordConfirm) errors.passwordConfirm = 'パスワード確認用は必須です';

  if (v.password && v.passwordConfirm && v.password !== v.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません';
  }

  return errors;
}
