import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export function About() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-mist">
        <img src="/images/lookbook-vest-charcoal.jpg" alt="Aria Fashion" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="container-boutique relative pb-12 text-cream">
          <p className="eyebrow mb-3 text-cream/80">{t("about.est")}</p>
          <h1 className="text-4xl sm:text-5xl">{t("about.title")}</h1>
        </div>
      </section>

      <section className="container-boutique grid grid-cols-1 gap-16 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">{t("about.whoWeAre")}</p>
          <h2 className="mb-5 text-3xl">{t("about.heading")}</h2>
          <p className="mb-4 text-sm leading-relaxed text-ink-soft">{t("about.body1")}</p>
          <p className="mb-8 text-sm leading-relaxed text-ink-soft">{t("about.body2")}</p>
          <Link to="/shop">
            <Button variant="outline">{t("about.shopCollection")}</Button>
          </Link>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-mist">
          <img src="/images/lookbook-dress-safari.jpg" alt="Aria Fashion styling" className="h-full w-full object-cover" />
        </div>
      </section>
    </div>
  );
}
