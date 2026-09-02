import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const forgotPassword = useForgotPassword();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    forgotPassword.mutate(email, { onError: (err) => setError(getErrorMessage(err)) });
  }

  if (forgotPassword.isSuccess) {
    return (
      <AuthLayout title="Check Your Email">
        <p className="text-center text-sm text-ink-soft">
          If an account exists for <strong className="text-ink">{email}</strong>, we've sent a link to reset your password.
        </p>
        <div className="mt-8 text-center">
          <Link to="/login" className="link-underline text-sm text-ink">
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="We'll email you a link to reset it">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg" loading={forgotPassword.isPending}>
          Send Reset Link
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        <Link to="/login" className="text-ink underline">
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
