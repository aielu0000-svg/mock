import { AppShell } from '../../../shared/components/layout/AppShell';
import { SignupForm } from '../components/SignupForm';

export function SignupPage() {
  return (
    <AppShell>
      <h1 className="page-title">会員登録</h1>
      <SignupForm />
    </AppShell>
  );
}
