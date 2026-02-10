import { Alert, AlertDescription, AlertTitle } from '../../../../shared/components/ui/alert';

export function FieldErrorSummary({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <Alert
      variant="destructive"
      className="mb-3 rounded border border-[#b00020] bg-[#fff0f2] px-3 py-2 text-[#111]"
      aria-live="polite"
    >
      <AlertTitle>入力内容を確認してください</AlertTitle>
      <AlertDescription>
        <ul className="m-0 list-disc pl-[18px]">
          {messages.map((m) => (
            <li key={m} className="my-[2px] font-extrabold text-[#b00020]">{m}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
