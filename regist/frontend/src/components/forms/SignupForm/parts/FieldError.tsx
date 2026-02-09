// frontend/src/components/forms/SignupForm/parts/FieldError.tsx
type Props = { message?: string };

export function FieldError({ message }: Props) {
  if (!message) return null;
  return <div className="field-error">{message}</div>;
}
