// frontend/src/components/forms/SignupForm/parts/FieldErrorSummary.tsx
type Props = { messages: string[] };

export function FieldErrorSummary({ messages }: Props) {
  if (!messages.length) return null;
  return (
    <div className="mb-4 rounded-md border border-danger/40 bg-warn-bg p-3">
      <ul className="list-disc pl-5 text-sm text-danger space-y-1">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
