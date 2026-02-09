// frontend/src/api/types.ts
export type FieldErrorItem = { field: string; message: string };

export type ApiError = {
  message?: string;
  fieldErrors?: FieldErrorItem[];
};

export type CreateMemberResponse = { id: string };

export type MemberDto = {
  id: string;
  name: {
    lastKanji: string;
    firstKanji: string;
    lastKana: string;
    firstKana: string;
  };
  birthDate: { year: string; month: string; day: string };
  gender: string;
  email: string;
  address: {
    zip1: string;
    zip2: string;
    prefecture: string;
    line1: string;
    line2: string;
  };
  phone: { tel1: string; tel2: string; tel3: string };
  newsletter: string;
};
