import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';

export function RequiredRemaining({ count }: { count: number }) {
  return (
    <Alert className="required-callout border-[#f8d98f] bg-[#fff7de]" aria-live="polite">
      <AlertDescription className="required-callout__inner">
        <p className="required-callout__lead">必須事項をご記入の上、<br />次ページへお進みください。</p>
        <div className="required-callout__bottom">
          <span className="required-callout__label">残り必須項目</span>
          <span className="required-callout__num">{count}</span>
          <span className="required-callout__unit">件</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
