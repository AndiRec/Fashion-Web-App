import { type FormEvent, useState } from "react";
import { Link, type Location, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegister } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState<string | null>(null);
  const register = useRegister();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from;
  const isCheckoutRedirect = from?.pathname === "/checkout";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    register.mutate(form, {
      onSuccess: (data) => {
        if (from) {
          navigate(`${from.pathname}${from.search}`, { replace: true });
        } else {
          navigate(data.user.is_admin ? "/admin" : "/account", { replace: true });
        }
      },
      onError: (err) => setError(getErrorMessage(err)),
    });
  }

  return (
    <AuthLayout
      title={t("auth.createAccount")}
      subtitle={isCheckoutRedirect ? t("auth.createAccountSubtitleCheckout") : t("auth.createAccountSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="name" label={t("auth.fullName")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input id="phone" label={t("auth.phone")} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input id="email" type="email" label={t("auth.email")} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input
          id="password"
          type="password"
          label={t("auth.password")}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          id="password_confirmation"
          type="password"
          label={t("auth.confirmPassword")}
          required
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg" loading={register.isPending}>
          {t("auth.createAccount")}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link to="/login" state={location.state} className="text-ink underline">
          {t("auth.signInLink")}
        </Link>
      </p>
    </AuthLayout>
  );
}
