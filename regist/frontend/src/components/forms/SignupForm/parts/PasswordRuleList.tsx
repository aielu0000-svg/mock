// frontend/src/components/forms/SignupForm/parts/PasswordRuleList.tsx
type Props = { value: string };

export function PasswordRuleList({ value }: Props) {
  const v = (value || "").toString();
  const okNum = /[0-9]/.test(v);
  const okAlpha = /[A-Za-z]/.test(v);
  const okSym = /[-!"#$%&'()*+,.\/:;<=>?@\[\]^_`{|}~]/.test(v);
  const okLen = v.length >= 8 && v.length <= 12;

  const Item = ({ ok, label }: { ok: boolean; label: string }) => (
    <li>
      <span>{label}</span>
      <span className={`pw-rules__status ${ok ? "is-ok" : ""}`}>{ok ? "○" : "×"}</span>
    </li>
  );

  return (
    <div className="pw-rules">
      <p className="pw-rules__title">パスワードの条件</p>
      <ul className="pw-rules__list">
        <Item ok={okLen} label="8〜12文字" />
        <Item ok={okAlpha} label="英字を含む" />
        <Item ok={okNum} label="数字を含む" />
        <Item ok={okSym} label="記号を含む" />
      </ul>
    </div>
  );
}
