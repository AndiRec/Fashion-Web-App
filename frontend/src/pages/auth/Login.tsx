import { type FormEvent, useState } from "react";
import { Link, type Location, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from;
  const isCheckoutRedirect = from?.pathname === "/checkout";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (from) {
            navigate(`${from.pathname}${from.search}`, { replace: true });
          } else {
            navigate(data.user.is_admin ? "/admin" : "/account", { replace: true });
          }
        },
        onError: (err) => setError(getErrorMessage(err)),
      },
    );
  }

  return (
    <AuthLayout
      title={t("auth.signIn")}
      subtitle={isCheckoutRedirect ? t("auth.signInSubtitleCheckout") : t("auth.signInSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label={t("auth.email")} required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" type="password" label={t("auth.password")} required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="link-underline text-xs text-ink-soft">
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
          {t("auth.signIn")}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        {t("auth.newToAria")}{" "}
        <Link to="/register" state={location.state} className="text-ink underline">
          {t("auth.createAnAccount")}
        </Link>
      </p>
    </AuthLayout>
  );
}
