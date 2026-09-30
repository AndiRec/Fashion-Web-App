import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useForgotPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ForgotPassword() {
  const { t } = useTranslation();
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
      <AuthLayout title={t("auth.checkEmailTitle")}>
        <p className="text-center text-sm text-ink-soft">
          <Trans i18nKey="auth.checkEmailBody" values={{ email }} components={{ strong: <strong className="text-ink" /> }} />
        </p>
        <div className="mt-8 text-center">
          <Link to="/login" className="link-underline text-sm text-ink">
            {t("auth.backToSignIn")}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.resetPasswordTitle")} subtitle={t("auth.resetPasswordSubtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label={t("auth.email")} required value={email} onChange={(e) => setEmail(e.target.value)} />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg" loading={forgotPassword.isPending}>
          {t("auth.sendResetLink")}
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
