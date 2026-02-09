type Props = {
  remaining: number;
};

export function RequiredRemaining({ remaining }: Props) {
  return (
    <>
      <div className="required-remaining" aria-live="polite">
        <span className="required-remaining__label">必須項目残り</span>
        <span className="required-remaining__count">{remaining}</span>
      </div>

      <div className="required-callout" aria-hidden="true">
        <div className="required-callout__inner">
          <p className="required-callout__lead">
            入力が必要な必須項目が
            <br />
            残っています
          </p>
          <div className="required-callout__bottom">
            <span className="required-callout__label">残り</span>
            <span className="required-callout__num">{remaining}</span>
            <span className="required-callout__unit">件</span>
          </div>
        </div>
      </div>
    </>
  );
}
