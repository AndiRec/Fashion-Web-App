import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="container-boutique flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="mb-4 text-3xl">Page Not Found</h1>
      <p className="mb-8 max-w-sm text-sm text-ink-soft">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
