// frontend/src/components/forms/SignupForm/parts/FieldError.tsx
type Props = { message?: string; field?: string };

export function FieldError({ message, field }: Props) {
  if (!message) return null;
  return (
    <div className="field-error" data-error-for={field}>
      {message}
    </div>
  );
}
