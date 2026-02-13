import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';

export function RequiredRemaining({ count }: { count: number }) {
  return (
    <Alert className="required-remaining" aria-live="polite">
      <AlertDescription className="required-remaining__body">
        <p className="required-remaining__lead">必須事項をご記入の上、<br />次ページへお進みください。</p>
        <div className="required-remaining__count-wrap">
          <span className="required-remaining__label">残り必須項目</span>
          <span className="required-remaining__count">{count}</span>
          <span className="required-remaining__unit">件</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
