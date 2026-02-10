export function FieldErrorSummary({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <div className="form-error-summary is-visible" role="alert" aria-live="polite">
      <ul>{messages.map((m) => <li key={m}>{m}</li>)}</ul>
    </div>
  );
}
