// frontend/src/components/forms/SignupForm/sections/PasswordSection.tsx
import { useMemo, useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { RequiredBadge } from "../parts/RequiredBadge";
import { FieldError } from "../parts/FieldError";
import { PasswordGuidance } from "../parts/PasswordGuidance";
import { PasswordRuleList } from "../parts/PasswordRuleList";

type FormValues = any;

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  submitCount: number;
  watch: UseFormWatch<FormValues>;
};

export function PasswordSection({ register, errors, submitCount, watch }: Props) {
  const [visible, setVisible] = useState(false);
  const pw = watch("password") || "";
  const confirm = watch("passwordConfirm") || "";

  const mismatch = useMemo(() => {
    if (!pw || !confirm) return "";
    return pw === confirm ? "" : "パスワードが一致しません。";
  }, [pw, confirm]);

  const showRequiredErrors = submitCount > 0;

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="flex items-center">
        <h2 className="text-base font-semibold">パスワード</h2>
        <RequiredBadge kind="section" />
      </div>

      <PasswordGuidance />

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm text-muted-fg">
            パスワード<RequiredBadge kind="field" />
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              className={`w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                showRequiredErrors && errors.password ? "input-error" : ""
              }`}
              type={visible ? "text" : "password"}
              {...register("password", {
                required: "パスワードを入力してください。",
                validate: (v) => {
                  const s = (v || "").toString();
                  if (s.length < 8 || s.length > 12) return "パスワードは8〜12文字で入力してください。";
                  if (!/[A-Za-z]/.test(s)) return "パスワードに英字を含めてください。";
                  if (!/[0-9]/.test(s)) return "パスワードに数字を含めてください。";
                  if (!/[-!\"#$%&'()*+,.\/:;<=>?@\[\]^_`{|}~]/.test(s)) return "パスワードに記号を含めてください。";
                  return true;
                }
              })}
            />
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-sm"
              aria-pressed={visible ? "true" : "false"}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? "非表示" : "表示"}
            </button>
          </div>
          <PasswordRuleList value={pw} />
          <FieldError message={showRequiredErrors ? (errors.password?.message as string) : ""} />
        </div>

        <div>
          <label className="text-sm text-muted-fg">
            パスワード（確認用）<RequiredBadge kind="field" />
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              className={`w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                showRequiredErrors && (errors.passwordConfirm || mismatch) ? "input-error" : ""
              }`}
              type={visible ? "text" : "password"}
              {...register("passwordConfirm", {
                required: "パスワード（確認用）を入力してください。",
                validate: (v) => {
                  const s = (v || "").toString();
                  if (!s) return true;
                  if (s !== (pw || "").toString()) return "パスワードが一致しません。";
                  return true;
                }
              })}
            />
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-sm"
              aria-pressed={visible ? "true" : "false"}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? "非表示" : "表示"}
            </button>
          </div>
          <FieldError message={showRequiredErrors ? ((errors.passwordConfirm?.message as string) || mismatch) : ""} />
        </div>
      </div>
    </section>
  );
}
