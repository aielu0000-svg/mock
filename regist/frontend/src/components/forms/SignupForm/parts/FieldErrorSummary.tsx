// frontend/src/components/forms/SignupForm/parts/FieldErrorSummary.tsx
type Props = { messages: string[] };

export function FieldErrorSummary({ messages }: Props) {
  if (!messages.length) return null;
  return (
    <div id="formErrorSummary" className="form-error-summary is-visible" role="alert">
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
