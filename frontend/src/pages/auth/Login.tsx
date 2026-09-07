import { type FormEvent, useState } from "react";
import { Link, type Location, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function Login() {
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
        onSuccess: () => {
          navigate(from ? `${from.pathname}${from.search}` : "/account", { replace: true });
        },
        onError: (err) => setError(getErrorMessage(err)),
      },
    );
  }

  return (
    <AuthLayout
      title="Sign In"
      subtitle={isCheckoutRedirect ? "Sign in to complete your order" : "Welcome back to Aria Fashion"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" type="password" label="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="link-underline text-xs text-ink-soft">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
          Sign In
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        New to Aria Fashion?{" "}
        <Link to="/register" state={location.state} className="text-ink underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
