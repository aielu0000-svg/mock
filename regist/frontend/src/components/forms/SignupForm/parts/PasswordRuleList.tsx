// frontend/src/components/forms/SignupForm/parts/PasswordRuleList.tsx
type Props = { value: string };

export function PasswordRuleList({ value }: Props) {
  const v = (value || "").toString();
  const okNum = /[0-9]/.test(v);
  const okAlpha = /[A-Za-z]/.test(v);
  const okSym = /[-!"#$%&'()*+,.\/:;<=>?@\[\]^_`{|}~]/.test(v);
  const okLen = v.length >= 8 && v.length <= 12;

  const Item = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={ok ? "text-primary" : "text-danger"}>{ok ? "○" : "×"}</span>
      <span className={ok ? "text-fg" : "text-danger"}>{label}</span>
    </div>
  );

  return (
    <div className="mt-2 space-y-1">
      <Item ok={okLen} label="8〜12文字" />
      <Item ok={okAlpha} label="英字を含む" />
      <Item ok={okNum} label="数字を含む" />
      <Item ok={okSym} label="記号を含む" />
    </div>
  );
}
