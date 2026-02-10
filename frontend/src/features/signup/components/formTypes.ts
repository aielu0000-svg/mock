import { ChangeEvent } from 'react';
import { SignupFormValue } from '../model/uiTypes';

export type BindField = (key: keyof SignupFormValue) => {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export type SignupValidationErrors = Partial<Record<keyof SignupFormValue, string>>;

export type PasswordStatus = {
  hasNumber: boolean;
  hasAlphabet: boolean;
  hasSymbol: boolean;
};
