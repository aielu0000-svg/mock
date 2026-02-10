export function FieldError({ message }: { message?: string }) {
  return <div className="field-error">{message ?? ''}</div>;
}
