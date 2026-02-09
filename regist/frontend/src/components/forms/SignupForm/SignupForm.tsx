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

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldErrorSummary messages={summaryMessages} />

      <section className="rounded-lg border border-border p-4">
        <div className="flex items-center">
          <h2 className="text-base font-semibold">個人情報</h2>
          <RequiredBadge kind="section" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-fg">
              姓（漢字）<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.lastNameKanji ? "input-error" : ""
              }`}
              {...register("lastNameKanji", { required: "姓（漢字）を入力してください。" })}
            />
            <FieldError message={show ? (errors.lastNameKanji?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              名（漢字）<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.firstNameKanji ? "input-error" : ""
              }`}
              {...register("firstNameKanji", { required: "名（漢字）を入力してください。" })}
            />
            <FieldError message={show ? (errors.firstNameKanji?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              姓（カナ）<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.lastNameKana ? "input-error" : ""
              }`}
              {...register("lastNameKana", { required: "姓（カナ）を入力してください。" })}
            />
            <FieldError message={show ? (errors.lastNameKana?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              名（カナ）<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.firstNameKana ? "input-error" : ""
              }`}
              {...register("firstNameKana", { required: "名（カナ）を入力してください。" })}
            />
            <FieldError message={show ? (errors.firstNameKana?.message as string) : ""} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-fg">
              生年<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.birthYear ? "input-error" : ""
              }`}
              inputMode="numeric"
              {...register("birthYear", { required: "生年を入力してください。" })}
            />
            <FieldError message={show ? (errors.birthYear?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              月<RequiredBadge kind="field" />
            </label>
            <select
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.birthMonth ? "input-error" : ""
              }`}
              {...register("birthMonth", { required: "月を選択してください。" })}
            >
              <option value="">選択</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </select>
            <FieldError message={show ? (errors.birthMonth?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              日<RequiredBadge kind="field" />
            </label>
            <select
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.birthDay ? "input-error" : ""
              }`}
              {...register("birthDay", { required: "日を選択してください。" })}
            >
              <option value="">選択</option>
              {Array.from({ length: 31 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </select>
            <FieldError message={show ? (errors.birthDay?.message as string) : ""} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-muted-fg">
            性別<RequiredBadge kind="field" />
          </div>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="male"
                {...register("gender", { required: "性別を選択してください。" })}
              />
              男性
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="female" {...register("gender")} />
              女性
            </label>
          </div>
          <FieldError message={show ? (errors.gender?.message as string) : ""} />
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-fg">
            メールアドレス<RequiredBadge kind="field" />
          </label>
          <input
            className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
              show && errors.email ? "input-error" : ""
            }`}
            inputMode="email"
            {...register("email", {
              required: "メールアドレスを入力してください。",
              validate: (s) => (/.+@.+\..+/.test((s || "").toString()) ? true : "メールアドレスの形式が正しくありません。")
            })}
          />
          <FieldError message={show ? (errors.email?.message as string) : ""} />
        </div>
      </section>

      <section className="rounded-lg border border-border p-4">
        <div className="flex items-center">
          <h2 className="text-base font-semibold">住所</h2>
          <RequiredBadge kind="section" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-muted-fg">
                郵便番号（上）<RequiredBadge kind="field" />
              </label>
              <input
                className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                  show && errors.zip1 ? "input-error" : ""
                }`}
                inputMode="numeric"
                {...register("zip1", { required: "郵便番号（上）を入力してください。" })}
              />
              <FieldError message={show ? (errors.zip1?.message as string) : ""} />
            </div>

            <div className="flex-1">
              <label className="text-sm text-muted-fg">
                郵便番号（下）<RequiredBadge kind="field" />
              </label>
              <input
                className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                  show && errors.zip2 ? "input-error" : ""
                }`}
                inputMode="numeric"
                {...register("zip2", { required: "郵便番号（下）を入力してください。" })}
              />
              <FieldError message={show ? (errors.zip2?.message as string) : ""} />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              都道府県<RequiredBadge kind="field" />
            </label>
            <select
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.prefecture ? "input-error" : ""
              }`}
              {...register("prefecture", { required: "都道府県を選択してください。" })}
            >
              <option value="">選択</option>
              <option value="福岡県">福岡県</option>
              <option value="東京都">東京都</option>
              <option value="大阪府">大阪府</option>
            </select>
            <FieldError message={show ? (errors.prefecture?.message as string) : ""} />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-fg">
            市区町村・番地<RequiredBadge kind="field" />
          </label>
          <input
            className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
              show && errors.addressLine1 ? "input-error" : ""
            }`}
            {...register("addressLine1", { required: "市区町村・番地を入力してください。" })}
          />
          <FieldError message={show ? (errors.addressLine1?.message as string) : ""} />
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-fg">
            アパート・マンション名等<RequiredBadge kind="optional" />
          </label>
          <input
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10"
            {...register("addressLine2")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border p-4">
        <div className="flex items-center">
          <h2 className="text-base font-semibold">連絡先</h2>
          <RequiredBadge kind="section" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-fg">
              電話番号1<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.tel1 ? "input-error" : ""
              }`}
              inputMode="numeric"
              {...register("tel1", { required: "電話番号1を入力してください。" })}
            />
            <FieldError message={show ? (errors.tel1?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              電話番号2<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.tel2 ? "input-error" : ""
              }`}
              inputMode="numeric"
              {...register("tel2", { required: "電話番号2を入力してください。" })}
            />
            <FieldError message={show ? (errors.tel2?.message as string) : ""} />
          </div>

          <div>
            <label className="text-sm text-muted-fg">
              電話番号3<RequiredBadge kind="field" />
            </label>
            <input
              className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 ${
                show && errors.tel3 ? "input-error" : ""
              }`}
              inputMode="numeric"
              {...register("tel3", { required: "電話番号3を入力してください。" })}
            />
            <FieldError message={show ? (errors.tel3?.message as string) : ""} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-muted-fg">メールマガジン</div>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="yes" {...register("newsletter")} />
              希望する
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="no" {...register("newsletter")} />
              希望しない
            </label>
          </div>
        </div>
      </section>

      <PasswordSection register={register as any} errors={errors as any} submitCount={submitCount} watch={(k: any) => (undefined as any)} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-fg">
          登録ボタン押下後に未入力がある場合、ここにエラーが表示されます。
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-fg disabled:opacity-60"
        >
          登録
        </button>
      </div>
    </form>
  );
}
