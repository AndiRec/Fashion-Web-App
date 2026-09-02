import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

export function Home() {
  const { data: featured, isLoading } = useFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[85vh] min-h-[560px] items-end overflow-hidden bg-mist">
        <img
          src="/images/lookbook-dress-yellow.jpg"
          alt="Aria Fashion new collection"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="container-boutique relative pb-16 text-cream">
          <p className="eyebrow mb-3 text-cream/80">Struga, North Macedonia</p>
          <h1 className="max-w-xl font-display text-5xl leading-tight sm:text-6xl">
            Effortless elegance, made for everyday.
          </h1>
          <div className="mt-8 flex gap-4">
            <Link to="/shop">
              <Button size="lg">Shop the Collection</Button>
            </Link>
            <Link to="/shop?new_collection=1">
              <Button size="lg" variant="outline" className="border-cream text-cream hover:bg-cream hover:text-ink">
                New In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-line bg-cream-soft">
        <div className="container-boutique grid grid-cols-1 divide-y divide-line py-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">Free local pickup</p>
            <p className="text-xs text-ink-soft">Order online, collect in Struga</p>
          </div>
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">Handpicked fabrics</p>
            <p className="text-xs text-ink-soft">Quality pieces, chosen with care</p>
          </div>
          <div className="px-4 py-4 sm:py-0">
            <p className="text-sm text-ink">Easy exchanges</p>
            <p className="text-xs text-ink-soft">Sized wrong? We'll make it right</p>
          </div>
        </div>
      </section>

      {/* New collection */}
      <section className="container-boutique py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">Just In</p>
            <h2 className="text-3xl">New Collection</h2>
          </div>
          <Link to="/shop?new_collection=1" className="link-underline hidden text-xs uppercase tracking-wider text-ink-soft sm:block">
            View All
          </Link>
        </div>
        {isLoading ? <Spinner /> : <ProductGrid products={featured?.new_collection ?? []} />}
      </section>

      {/* Editorial split */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-[4/5] lg:aspect-auto">
          <img src="/images/lookbook-blazer-blue.jpg" alt="Aria Fashion boutique" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center bg-taupe/15 px-8 py-16 lg:px-16">
          <div className="max-w-md">
            <p className="eyebrow mb-3">Our Story</p>
            <h2 className="mb-5 text-3xl">A boutique rooted in Struga</h2>
            <p className="mb-8 text-sm leading-relaxed text-ink-soft">
              Aria Fashion began as a small atelier on the shore of Lake Ohrid, built on a simple idea: clothing
              should feel as good as it looks. Every piece we carry is chosen for its craftsmanship, its
              silhouette, and the way it moves with you.
            </p>
            <Link to="/about">
              <Button variant="outline">Read Our Story</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sale */}
      {featured?.on_sale && featured.on_sale.length > 0 ? (
        <section className="container-boutique py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Limited Time</p>
              <h2 className="text-3xl">Current Sale</h2>
            </div>
            <Link to="/shop?on_sale=1" className="link-underline hidden text-xs uppercase tracking-wider text-ink-soft sm:block">
              View All
            </Link>
          </div>
          <ProductGrid products={featured.on_sale} />
        </section>
      ) : null}

      {/* Lookbook strip */}
      <section className="container-boutique pb-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Lookbook</p>
          <h2 className="text-3xl">Styled in Aria</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["lookbook-vest-charcoal.jpg", "lookbook-dress-safari.jpg", "lookbook-blazer-blush.jpg"].map((img) => (
            <Link key={img} to="/shop" className="group relative aspect-[3/4] overflow-hidden bg-mist">
              <img
                src={`/images/${img}`}
                alt="Aria Fashion lookbook"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/50 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-xs uppercase tracking-wider text-cream">Shop the Look</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
