export function PasswordRuleList({ status }: { status: { hasNumber: boolean; hasAlphabet: boolean; hasSymbol: boolean } }) {
  return (
    <ul className="help-text">
      <li>{status.hasNumber ? '○' : '×'} 数字を含む</li>
      <li>{status.hasAlphabet ? '○' : '×'} 英字を含む</li>
      <li>{status.hasSymbol ? '○' : '×'} 記号を含む</li>
    </ul>
  );
}
