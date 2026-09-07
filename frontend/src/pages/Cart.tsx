import { Link } from "react-router-dom";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

export function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const push = useToastStore((s) => s.push);

  if (isLoading) return <Spinner className="py-32" />;

  if (!cart || cart.length === 0) {
    return (
      <div className="container-boutique">
        <EmptyState
          title="Your bag is empty"
          description="Explore the collection and find something you love."
          action={
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="container-boutique py-12">
      <h1 className="mb-10 text-3xl">Your Bag</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <li key={item.id} className="animate-item-in flex gap-5 py-6">
              <Link to={`/products/${item.product.id}`} className="h-32 w-24 flex-shrink-0 bg-mist">
                {item.product.images[0] ? (
                  <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/products/${item.product.id}`} className="text-sm text-ink hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-soft">Size {item.size}</p>
                  </div>
                  <span className="text-sm text-ink">{formatPrice(item.line_total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      className="press p-2 disabled:opacity-30 disabled:active:scale-100"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateItem.mutate(
                          { id: item.id, quantity: item.quantity - 1 },
                          { onError: (err) => push(getErrorMessage(err), "error") },
                        )
                      }
                    >
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      className="press p-2 disabled:opacity-30 disabled:active:scale-100"
                      disabled={item.available_stock !== null && item.quantity >= (item.available_stock ?? 0)}
                      onClick={() =>
                        updateItem.mutate(
                          { id: item.id, quantity: item.quantity + 1 },
                          { onError: (err) => push(getErrorMessage(err), "error") },
                        )
                      }
                    >
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem.mutate(item.id, { onError: (err) => push(getErrorMessage(err), "error") })}
                    className="press flex items-center gap-1.5 text-xs text-ink-soft hover:text-rust"
                  >
                    <TrashIcon width={14} height={14} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-line bg-cream-soft p-6">
          <h2 className="mb-5 font-display text-xl">Order Summary</h2>
          <div className="flex justify-between border-b border-line pb-4 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <span className="text-ink">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between py-4 text-sm text-ink-soft">
            <span>Shipping</span>
            <span>Calculated at pickup</span>
          </div>
          <div className="mb-6 flex justify-between border-t border-line pt-4 text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
