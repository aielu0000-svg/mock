// frontend/src/components/forms/SignupForm/SignupForm.tsx
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createMember, type CreateMemberRequest } from "../../../api/members";
import { HttpError } from "../../../api/client";
import { toFieldErrorMap } from "../../../api/errors";
import { FieldErrorSummary } from "./parts/FieldErrorSummary";
import { PasswordSection } from "./sections/PasswordSection";
import { RequiredBadge } from "./parts/RequiredBadge";
import { FieldError } from "./parts/FieldError";
import { RequiredRemaining } from "./parts/RequiredRemaining";

type FormValues = {
  lastNameKanji: string;
  firstNameKanji: string;
  lastNameKana: string;
  firstNameKana: string;

  birthYear: string;
  birthMonth: string;
  birthDay: string;

  gender: string;
  email: string;

  zip1: string;
  zip2: string;
  prefecture: string;
  addressLine1: string;
  addressLine2: string;

  tel1: string;
  tel2: string;
  tel3: string;

  newsletter: string;

  password: string;
  passwordConfirm: string;
};

type Props = {
  onSuccess: (id: string) => void;
};

export function SignupForm({ onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, submitCount }
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      gender: "",
      newsletter: "no",
      birthMonth: "",
      birthDay: "",
      prefecture: ""
    }
  });

  const summaryMessages = useMemo(() => {
    if (submitCount <= 0) return [];
    const msgs: string[] = [];
    const pick = (k: keyof FormValues) => {
      const m = errors[k]?.message;
      if (typeof m === "string" && m) msgs.push(m);
    };
    pick("lastNameKanji");
    pick("firstNameKanji");
    pick("lastNameKana");
    pick("firstNameKana");
    pick("birthYear");
    pick("birthMonth");
    pick("birthDay");
    pick("gender");
    pick("email");
    pick("zip1");
    pick("zip2");
    pick("prefecture");
    pick("addressLine1");
    pick("tel1");
    pick("tel2");
    pick("tel3");
    pick("password");
    pick("passwordConfirm");
    return msgs;
  }, [errors, submitCount]);

  const requiredFields: (keyof FormValues)[] = [
    "lastNameKanji",
    "firstNameKanji",
    "lastNameKana",
    "firstNameKana",
    "birthYear",
    "birthMonth",
    "birthDay",
    "gender",
    "email",
    "zip1",
    "zip2",
    "prefecture",
    "addressLine1",
    "tel1",
    "tel2",
    "tel3",
    "newsletter",
    "password",
    "passwordConfirm"
  ];
  const requiredValues = watch(requiredFields);
  const remainingRequired = useMemo(() => {
    return requiredValues.reduce((count, value) => {
      const v = (value ?? "").toString().trim();
      return v ? count : count + 1;
    }, 0);
  }, [requiredValues]);

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    try {
      const body: CreateMemberRequest = {
        name: {
          lastKanji: v.lastNameKanji.trim(),
          firstKanji: v.firstNameKanji.trim(),
          lastKana: v.lastNameKana.trim(),
          firstKana: v.firstNameKana.trim()
        },
        birthDate: {
          year: v.birthYear.trim(),
          month: v.birthMonth.trim(),
          day: v.birthDay.trim()
        },
        gender: v.gender.trim(),
        email: v.email.trim(),
        address: {
          zip1: v.zip1.trim(),
          zip2: v.zip2.trim(),
          prefecture: v.prefecture.trim(),
          line1: v.addressLine1.trim(),
          line2: v.addressLine2.trim()
        },
        phone: {
          tel1: v.tel1.trim(),
          tel2: v.tel2.trim(),
          tel3: v.tel3.trim()
        },
        newsletter: v.newsletter.trim(),
        password: v.password,
        passwordConfirm: v.passwordConfirm
      };

      const res = await createMember(body);
      alert("登録しました");
      onSuccess(res.id);
    } catch (e) {
      if (e instanceof HttpError) {
        const map = toFieldErrorMap(e.body?.fieldErrors);
        for (const [field, message] of Object.entries(map)) {
          setError(field as any, { type: "server", message });
        }
        const msgs = Object.values(map);
        alert(msgs.length ? msgs.join("\n") : (e.body?.message || "入力内容を確認してください。"));
        return;
      }
      alert("通信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const show = submitCount > 0;

  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県"
  ];

  return (
    <form id="signupForm" className="signup-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldErrorSummary messages={summaryMessages} />
      <RequiredRemaining remaining={remainingRequired} />

      <section className="form-section">
        <h2 className="section-title">
          個人情報
          <RequiredBadge kind="section" />
        </h2>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">氏名</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="input-pair">
              <div className="input-field">
                <label className="input-sub-label">
                  姓（漢字）<RequiredBadge kind="field" />
                </label>
                <input
                  className={`input-text ${show && errors.lastNameKanji ? "input-error" : ""}`}
                  {...register("lastNameKanji", { required: "姓（漢字）を入力してください。" })}
                />
                <FieldError message={show ? (errors.lastNameKanji?.message as string) : ""} />
              </div>
              <div className="input-field">
                <label className="input-sub-label">
                  名（漢字）<RequiredBadge kind="field" />
                </label>
                <input
                  className={`input-text ${show && errors.firstNameKanji ? "input-error" : ""}`}
                  {...register("firstNameKanji", { required: "名（漢字）を入力してください。" })}
                />
                <FieldError message={show ? (errors.firstNameKanji?.message as string) : ""} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">氏名（カナ）</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="input-pair">
              <div className="input-field">
                <label className="input-sub-label">
                  セイ<RequiredBadge kind="field" />
                </label>
                <input
                  className={`input-text ${show && errors.lastNameKana ? "input-error" : ""}`}
                  {...register("lastNameKana", { required: "姓（カナ）を入力してください。" })}
                />
                <FieldError message={show ? (errors.lastNameKana?.message as string) : ""} />
              </div>
              <div className="input-field">
                <label className="input-sub-label">
                  メイ<RequiredBadge kind="field" />
                </label>
                <input
                  className={`input-text ${show && errors.firstNameKana ? "input-error" : ""}`}
                  {...register("firstNameKana", { required: "名（カナ）を入力してください。" })}
                />
                <FieldError message={show ? (errors.firstNameKana?.message as string) : ""} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">生年月日</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="input-birth">
              <input
                className={`input-text input-year ${show && errors.birthYear ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="1990"
                {...register("birthYear", { required: "生年を入力してください。" })}
              />
              <span className="unit-text">年</span>
              <select
                className={`input-select input-month ${show && errors.birthMonth ? "input-error" : ""}`}
                {...register("birthMonth", { required: "月を選択してください。" })}
              >
                <option value="">選択</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="unit-text">月</span>
              <select
                className={`input-select input-day ${show && errors.birthDay ? "input-error" : ""}`}
                {...register("birthDay", { required: "日を選択してください。" })}
              >
                <option value="">選択</option>
                {Array.from({ length: 31 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="unit-text">日</span>
            </div>
            <div className="field-error-group">
              <FieldError message={show ? (errors.birthYear?.message as string) : ""} />
              <FieldError message={show ? (errors.birthMonth?.message as string) : ""} />
              <FieldError message={show ? (errors.birthDay?.message as string) : ""} />
            </div>
            <div className="inline-warn">
              <span className="inline-warn__icon" aria-hidden="true" />
              生年月日は半角数字で入力してください。
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">性別</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  value="male"
                  {...register("gender", { required: "性別を選択してください。" })}
                />
                男性
              </label>
              <label className="radio-item">
                <input type="radio" value="female" {...register("gender")} />
                女性
              </label>
            </div>
            <FieldError message={show ? (errors.gender?.message as string) : ""} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">メールアドレス</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <input
              className={`input-text ${show && errors.email ? "input-error" : ""}`}
              inputMode="email"
              {...register("email", {
                required: "メールアドレスを入力してください。",
                validate: (s) => (/.+@.+\..+/.test((s || "").toString()) ? true : "メールアドレスの形式が正しくありません。")
              })}
            />
            <p className="help-text">ご登録のメールアドレスにご案内をお送りします。</p>
            <FieldError message={show ? (errors.email?.message as string) : ""} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">
          住所
          <RequiredBadge kind="section" />
        </h2>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">郵便番号</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="input-zip">
              <input
                className={`input-text input-zip1 ${show && errors.zip1 ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="123"
                {...register("zip1", { required: "郵便番号（上）を入力してください。" })}
              />
              <span className="unit-text">-</span>
              <input
                className={`input-text input-zip2 ${show && errors.zip2 ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="4567"
                {...register("zip2", { required: "郵便番号（下）を入力してください。" })}
              />
            </div>
            <div className="field-error-group">
              <FieldError message={show ? (errors.zip1?.message as string) : ""} />
              <FieldError message={show ? (errors.zip2?.message as string) : ""} />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">都道府県</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <select
              className={`input-select ${show && errors.prefecture ? "input-error" : ""}`}
              {...register("prefecture", { required: "都道府県を選択してください。" })}
            >
              <option value="">選択</option>
              {prefectures.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <FieldError message={show ? (errors.prefecture?.message as string) : ""} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">市区町村・番地</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <input
              className={`input-text ${show && errors.addressLine1 ? "input-error" : ""}`}
              {...register("addressLine1", { required: "市区町村・番地を入力してください。" })}
            />
            <FieldError message={show ? (errors.addressLine1?.message as string) : ""} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">アパート・マンション名等</span>
            <RequiredBadge kind="optional" />
          </div>
          <div className="form-control">
            <input className="input-text" {...register("addressLine2")} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">
          連絡先
          <RequiredBadge kind="section" />
        </h2>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">電話番号</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="input-tel">
              <input
                className={`input-text input-tel1 ${show && errors.tel1 ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="090"
                {...register("tel1", { required: "電話番号1を入力してください。" })}
              />
              <span className="unit-text">-</span>
              <input
                className={`input-text input-tel2 ${show && errors.tel2 ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="1234"
                {...register("tel2", { required: "電話番号2を入力してください。" })}
              />
              <span className="unit-text">-</span>
              <input
                className={`input-text input-tel3 ${show && errors.tel3 ? "input-error" : ""}`}
                inputMode="numeric"
                placeholder="5678"
                {...register("tel3", { required: "電話番号3を入力してください。" })}
              />
            </div>
            <div className="field-error-group">
              <FieldError message={show ? (errors.tel1?.message as string) : ""} />
              <FieldError message={show ? (errors.tel2?.message as string) : ""} />
              <FieldError message={show ? (errors.tel3?.message as string) : ""} />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-label">
            <span className="form-label__text">メールマガジン</span>
            <span className="badge badge--required">必須</span>
          </div>
          <div className="form-control">
            <div className="radio-group">
              <label className="radio-item">
                <input type="radio" value="yes" {...register("newsletter", { required: "選択してください。" })} />
                希望する
              </label>
              <label className="radio-item">
                <input type="radio" value="no" {...register("newsletter")} />
                希望しない
              </label>
            </div>
            <FieldError message={show ? (errors.newsletter?.message as string) : ""} />
          </div>
        </div>
      </section>

      <PasswordSection register={register as any} errors={errors as any} submitCount={submitCount} watch={watch as any} />

      <div className="form-actions">
        <button type="submit" disabled={submitting} className="button button--primary">
          登録する
        </button>
      </div>
    </form>
  );
}
