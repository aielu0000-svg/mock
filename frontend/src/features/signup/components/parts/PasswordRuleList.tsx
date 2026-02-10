export function PasswordRuleList({ status }: { status: { hasNumber: boolean; hasAlphabet: boolean; hasSymbol: boolean } }) {
  return (
    <div className="pw-rules" id="pwRules">
      <div className="pw-rules__title">入力文字組み合わせ</div>
      <ul className="pw-rules__list">
        <li><span className="pw-rules__label">数字</span><span id="numberCheck" className={`pw-rules__status ${status.hasNumber ? 'is-ok' : ''}`}>{status.hasNumber ? '○' : '×'}</span></li>
        <li><span className="pw-rules__label">アルファベット</span><span id="charCheck" className={`pw-rules__status ${status.hasAlphabet ? 'is-ok' : ''}`}>{status.hasAlphabet ? '○' : '×'}</span></li>
        <li><span className="pw-rules__label">記号</span><span id="codeCheck" className={`pw-rules__status ${status.hasSymbol ? 'is-ok' : ''}`}>{status.hasSymbol ? '○' : '×'}</span></li>
      </ul>
    </div>
  );
}
