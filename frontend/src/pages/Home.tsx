import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export function Home() {
  const { data: featured, isLoading } = useFeaturedProducts();
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[85vh] min-h-[560px] items-end overflow-hidden bg-mist">
        <img
          src="/images/aria2.jpeg"
          alt={t("home.boutiqueInterior")}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 via-45% to-transparent" />
        <div className="container-boutique relative pb-16 text-cream [text-shadow:0_2px_16px_rgb(0_0_0_/_35%)]">
          <p className="eyebrow mb-3 text-cream/90">{t("home.heroLocation")}</p>
          <h1 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cream/80">{t("home.heroAttribution")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                {t("home.shopCollection")}
              </Button>
            </Link>
            <Link to="/shop?new_collection=1" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full border border-white text-white hover:bg-white hover:text-ink sm:w-auto"
              >
                {t("home.newIn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-line bg-cream-soft">
        <div className="container-boutique grid grid-cols-1 divide-y divide-line py-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">{t("home.pickupTitle")}</p>
            <p className="text-xs text-ink-soft">{t("home.pickupDesc")}</p>
          </div>
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">{t("home.fabricsTitle")}</p>
            <p className="text-xs text-ink-soft">{t("home.fabricsDesc")}</p>
          </div>
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">{t("home.exchangesTitle")}</p>
            <p className="text-xs text-ink-soft">{t("home.exchangesDesc")}</p>
          </div>
        </div>
      </section>

      {/* New collection */}
      <section className="container-boutique py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">{t("home.justIn")}</p>
            <h2 className="text-3xl">{t("home.newCollection")}</h2>
          </div>
          <Link to="/shop?new_collection=1" className="link-underline hidden text-xs uppercase tracking-wider text-ink-soft sm:block">
            {t("home.viewAll")}
          </Link>
        </div>
        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={featured?.new_collection ?? []} />}
      </section>

      {/* Editorial split */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-[4/5] lg:aspect-auto">
          <img src="/images/lookbook-blazer-blue.jpg" alt={t("home.boutiqueImage")} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center bg-taupe/15 px-8 py-16 lg:px-16">
          <div className="max-w-md">
            <p className="eyebrow mb-3">{t("home.ourStory")}</p>
            <h2 className="mb-5 text-3xl">{t("home.storyTitle")}</h2>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft">{t("home.storyBody")}</p>
            <Link to="/about">
              <Button variant="outline">{t("home.readStory")}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sale */}
      {isLoading || (featured?.on_sale && featured.on_sale.length > 0) ? (
        <section className="container-boutique py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">{t("home.limitedTime")}</p>
              <h2 className="text-3xl">{t("home.currentSale")}</h2>
            </div>
            <Link to="/shop?on_sale=1" className="link-underline hidden text-xs uppercase tracking-wider text-ink-soft sm:block">
              {t("home.viewAll")}
            </Link>
          </div>
          {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={featured?.on_sale ?? []} />}
        </section>
      ) : null}

      {/* Lookbook strip */}
      <section className="container-boutique pb-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">{t("home.lookbook")}</p>
          <h2 className="text-3xl">{t("home.styledIn")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["lookbook-vest-charcoal.jpg", "lookbook-dress-safari.jpg", "lookbook-blazer-blush.jpg"].map((img) => (
            <Link key={img} to="/shop" className="group relative aspect-[3/4] overflow-hidden bg-mist">
              <img
                src={`/images/${img}`}
                alt={t("home.lookbookImage")}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/50 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-xs uppercase tracking-wider text-cream">{t("home.shopTheLook")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
