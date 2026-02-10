import { Alert, AlertDescription, AlertTitle } from '../../../../shared/components/ui/alert';

export function FieldErrorSummary({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <Alert variant="destructive" className="form-error-summary is-visible" aria-live="polite">
      <AlertTitle>入力内容を確認してください</AlertTitle>
      <AlertDescription>
        <ul>{messages.map((m) => <li key={m}>{m}</li>)}</ul>
      </AlertDescription>
    </Alert>
  );
}
