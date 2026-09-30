import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResetPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const resetPassword = useResetPassword();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    resetPassword.mutate(
      { token, email, password, password_confirmation: passwordConfirmation },
      {
        onSuccess: () => navigate("/login", { replace: true }),
        onError: (err) => setError(getErrorMessage(err)),
      },
    );
  }

  return (
    <AuthLayout title={t("auth.setNewPasswordTitle")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" label={t("auth.email")} value={email} disabled className="opacity-70" />
        <Input id="password" type="password" label={t("auth.newPassword")} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input
          id="password_confirmation"
          type="password"
          label={t("auth.confirmNewPassword")}
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg" loading={resetPassword.isPending}>
          {t("auth.resetPasswordButton")}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        <Link to="/login" className="text-ink underline">
          {t("auth.backToSignIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}
