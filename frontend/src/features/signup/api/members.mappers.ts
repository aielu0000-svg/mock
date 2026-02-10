import { CreateMemberRequest } from './members.types';
import { SignupFormValue } from '../model/uiTypes';

export function toCreateMemberRequest(v: SignupFormValue): CreateMemberRequest {
  return {
    name: {
      lastKanji: v.lastNameKanji,
      firstKanji: v.firstNameKanji,
      lastKana: v.lastNameKana,
      firstKana: v.firstNameKana
    },
    birthDate: { year: v.birthYear, month: v.birthMonth, day: v.birthDay },
    gender: v.gender,
    email: v.email,
    address: {
      zip1: v.zip1,
      zip2: v.zip2,
      prefecture: v.prefecture,
      line1: v.addressLine1,
      line2: v.addressLine2
    },
    phone: { tel1: v.tel1, tel2: v.tel2, tel3: v.tel3 },
    newsletter: v.newsletter,
    password: v.password,
    passwordConfirm: v.passwordConfirm
  };
}
