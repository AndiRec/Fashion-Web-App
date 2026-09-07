import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

export function Wishlist() {
  const { data: wishlist, isLoading } = useWishlist();

  if (isLoading) return <Spinner className="py-32" />;

  return (
    <div className="container-boutique py-12">
      <BackButton fallback="/shop" className="mb-5" />
      <h1 className="mb-10 text-3xl">Your Wishlist</h1>
      {!wishlist || wishlist.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the heart on any product to save it here."
          action={
            <Link to="/shop">
              <Button>Explore the Shop</Button>
            </Link>
          }
        />
      ) : (
        <ProductGrid products={wishlist.map((item) => item.product)} />
      )}
    </div>
  );
}
