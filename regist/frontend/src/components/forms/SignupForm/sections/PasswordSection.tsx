// frontend/src/components/forms/SignupForm/sections/PasswordSection.tsx
import { useMemo, useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { RequiredBadge } from "../parts/RequiredBadge";
import { FieldError } from "../parts/FieldError";
import { PasswordGuidance } from "../parts/PasswordGuidance";
import { PasswordRuleList } from "../parts/PasswordRuleList";

type FormValues = any;

const ICON_HIDE =
  'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m644 628-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660 556q0 20-4 37.5T644 628Zm128 126-58-56q38-29 67.5-63.5T832 556q-50-101-143.5-160.5T480 336q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920 556q-23 59-60.5 109.5T772 754Zm20 246L624 834q-35 11-70.5 16.5T480 856q-151 0-269-83.5T40 556q21-53 53-98.5t73-81.5L56 264l56-56 736 736-56 56ZM222 432q-29 26-53 57t-41 67q50 101 143.5 160.5T480 776q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300 556q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';
const ICON_SHOW =
  'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Zm0-300Zm0 220q113 0 207.5-59.5T832 556q-50-101-144.5-160.5T480 336q-113 0-207.5 59.5T128 556q50 101 144.5 160.5T480 776Z"/></svg>';

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
    <section className="form-section">
      <h2 className="section-title">
        パスワード
        <RequiredBadge kind="section" />
      </h2>

      <PasswordGuidance />

      <div className="form-row">
        <div className="form-label">
          <span className="form-label__text">パスワード</span>
          <span className="badge badge--required">必須</span>
        </div>
        <div className="form-control">
          <label className="input-sub-label">
            パスワード<RequiredBadge kind="field" />
          </label>
          <div className="pw-field-row">
            <div className="pw-input-wrap">
              <input
                className={`input-text input-text--pw ${showRequiredErrors && errors.password ? "input-error" : ""}`}
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
                className="pw-visibility"
                aria-pressed={visible ? "true" : "false"}
                aria-label={visible ? "パスワードを隠す" : "パスワードを表示"}
                onClick={() => setVisible((v) => !v)}
              >
                <img className="pw-visibility__img" src={visible ? ICON_SHOW : ICON_HIDE} alt="" aria-hidden="true" />
              </button>
            </div>
            <span className="pw-note">半角英字・数字・記号を含む8〜12文字</span>
          </div>
          <PasswordRuleList value={pw} />
          <FieldError field="password" message={showRequiredErrors ? (errors.password?.message as string) : ""} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label">
          <span className="form-label__text">パスワード（確認用）</span>
          <span className="badge badge--required">必須</span>
        </div>
        <div className="form-control">
          <label className="input-sub-label">
            パスワード（確認用）<RequiredBadge kind="field" />
          </label>
          <div className="pw-field-row">
            <div className="pw-input-wrap">
              <input
                className={`input-text input-text--pw ${
                  showRequiredErrors && (errors.passwordConfirm || mismatch) ? "input-error" : ""
                }`}
                type={visible ? "text" : "password"}
                {...register("passwordConfirm", {
                  required: "パスワード確認用を入力してください。",
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
                className="pw-visibility"
                aria-pressed={visible ? "true" : "false"}
                aria-label={visible ? "パスワード確認用を隠す" : "パスワード確認用を表示"}
                onClick={() => setVisible((v) => !v)}
              >
                <img className="pw-visibility__img" src={visible ? ICON_SHOW : ICON_HIDE} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
          <FieldError
            field="passwordConfirm"
            message={showRequiredErrors ? ((errors.passwordConfirm?.message as string) || mismatch) : ""}
          />
        </div>
      </div>
    </section>
  );
}
