import { Link } from "react-router-dom";
import { useUiStore } from "@/store/ui";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { MinusIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUiStore();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const push = useToastStore((s) => s.push);

  if (!cartOpen) return null;

  const total = cart?.reduce((sum, item) => sum + item.line_total, 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={closeCart}>
      <div
        className="animate-slide-in-right ml-auto flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl">Your Bag</h2>
          <button onClick={closeCart} aria-label="Close cart">
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : !cart || cart.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-soft">Your bag is empty.</p>
          ) : (
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <Link to={`/products/${item.product.id}`} onClick={closeCart} className="h-24 w-20 flex-shrink-0 bg-mist">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-ink">{item.product.name}</p>
                        <p className="text-xs text-ink-soft">Size {item.size}</p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem.mutate(item.id, { onError: (err) => push(getErrorMessage(err), "error") })
                        }
                        aria-label="Remove item"
                        className="text-ink-soft hover:text-rust"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          className="p-1.5 disabled:opacity-30"
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
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="p-1.5 disabled:opacity-30"
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
                      <span className="text-sm text-ink">{formatPrice(item.line_total)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.length > 0 ? (
          <div className="border-t border-line px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="text-ink">{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" onClick={closeCart}>
              <Button className="w-full" size="lg">
                Checkout
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
