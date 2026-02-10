import { SignupFormValue } from '../model/uiTypes';

const requiredKeys: (keyof SignupFormValue)[] = [
  'lastNameKanji', 'firstNameKanji', 'lastNameKana', 'firstNameKana',
  'birthYear', 'birthMonth', 'birthDay', 'gender', 'email',
  'zip1', 'zip2', 'prefecture', 'addressLine1',
  'tel1', 'tel2', 'tel3', 'newsletter', 'password', 'passwordConfirm'
];

export function getRequiredRemaining(value: SignupFormValue) {
  return requiredKeys.filter((k) => !String(value[k] ?? '').trim()).length;
}
