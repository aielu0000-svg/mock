export function RequiredRemaining({ count }: { count: number }) {
  return (
    <div className="required-callout" aria-live="polite">
      <div className="required-callout__inner">
        <p className="required-callout__lead">必須事項をご記入の上、<br />次ページへお進みください。</p>
        <div className="required-callout__bottom">
          <span className="required-callout__label">残り必須項目</span>
          <span className="required-callout__num">{count}</span>
          <span className="required-callout__unit">件</span>
        </div>
      </div>
    </div>
  );
}
