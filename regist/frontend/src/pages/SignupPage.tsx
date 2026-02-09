// frontend/src/pages/SignupPage.tsx
import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/forms/SignupForm/SignupForm";

export function SignupPage() {
  const nav = useNavigate();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">会員登録</h1>
      <SignupForm onSuccess={(id) => nav(`/member/${encodeURIComponent(id)}/edit`)} />
    </div>
  );
}
