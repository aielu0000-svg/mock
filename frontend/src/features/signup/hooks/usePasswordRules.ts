export function usePasswordRules(password: string) {
  return {
    hasNumber: /[0-9]/.test(password),
    hasAlphabet: /[A-Za-z]/.test(password),
    hasSymbol: /[-!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/.test(password)
  };
}
