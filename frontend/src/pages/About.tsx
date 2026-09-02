import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function About() {
  return (
    <div>
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-mist">
        <img src="/images/lookbook-vest-charcoal.jpg" alt="Aria Fashion" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="container-boutique relative pb-12 text-cream">
          <p className="eyebrow mb-3 text-cream/80">Est. in Struga</p>
          <h1 className="text-4xl sm:text-5xl">Our Story</h1>
        </div>
      </section>

      <section className="container-boutique grid grid-cols-1 gap-16 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Who We Are</p>
          <h2 className="mb-5 text-3xl">Made for Struga, worn everywhere</h2>
          <p className="mb-4 text-sm leading-relaxed text-ink-soft">
            Aria Fashion is a small boutique on the shore of Lake Ohrid, in the heart of Struga. We started with a
            simple belief: getting dressed should feel effortless, not overwhelming. Every collection we curate
            balances timeless silhouettes with the details that make a piece feel special.
          </p>
          <p className="mb-8 text-sm leading-relaxed text-ink-soft">
            We work closely with our customers — in the shop and online — to help everyone find pieces that fit
            their life, not just their measurements. That's the philosophy behind everything we carry.
          </p>
          <Link to="/shop">
            <Button variant="outline">Shop the Collection</Button>
          </Link>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-mist">
          <img src="/images/lookbook-dress-safari.jpg" alt="Aria Fashion styling" className="h-full w-full object-cover" />
        </div>
      </section>
    </div>
  );
}
