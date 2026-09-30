import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container-boutique flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-3">{t("notFound.eyebrow")}</p>
      <h1 className="mb-4 text-3xl">{t("notFound.title")}</h1>
      <p className="mb-8 max-w-sm text-sm text-ink-soft">{t("notFound.description")}</p>
      <Link to="/">
        <Button>{t("notFound.backHome")}</Button>
      </Link>
    </div>
  );
}
