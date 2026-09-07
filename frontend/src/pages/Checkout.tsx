import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { useCheckout } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import clsx from "clsx";

export function Checkout() {
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const checkout = useCheckout();
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const [phone, setPhone] = useState(user?.phone ?? "");
  const [addressId, setAddressId] = useState<number | "new">("new");
  const [newAddress, setNewAddress] = useState({ street_address: "", city: "", postal_code: "", country: "North Macedonia" });

  if (cartLoading || addressesLoading) return <Spinner className="py-32" />;

  if (!cart || cart.length === 0) {
    return (
      <div className="container-boutique py-12">
        <BackButton fallback="/cart" className="mb-5" />
        <EmptyState
          title="Your bag is empty"
          description="Add products to your bag before checking out."
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    checkout.mutate(
      {
        phone,
        ...(addressId === "new" ? newAddress : { address_id: addressId }),
      },
      {
        onSuccess: (order) => {
          push("Order placed successfully!");
          navigate(`/account/orders/${order.id}`);
        },
        onError: (err) => push(getErrorMessage(err), "error"),
      },
    );
  }

  return (
    <div className="container-boutique py-12">
      <BackButton fallback="/cart" className="mb-5" />
      <h1 className="mb-10 text-3xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <div>
            <h2 className="eyebrow mb-4">Contact</h2>
            <Input id="phone" label="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <h2 className="eyebrow mb-4">Delivery Address</h2>
            <div className="space-y-3">
              {addresses?.map((address) => (
                <label
                  key={address.id}
                  className={clsx(
                    "flex cursor-pointer items-start gap-3 border p-4 text-sm",
                    addressId === address.id ? "border-ink" : "border-line",
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={addressId === address.id}
                    onChange={() => setAddressId(address.id)}
                    className="mt-1"
                  />
                  <span>
                    {address.street_address}, {address.city} {address.postal_code}, {address.country}
                  </span>
                </label>
              ))}

              <label className={clsx("flex cursor-pointer items-start gap-3 border p-4 text-sm", addressId === "new" ? "border-ink" : "border-line")}>
                <input type="radio" name="address" checked={addressId === "new"} onChange={() => setAddressId("new")} className="mt-1" />
                <span>Use a new address</span>
              </label>

              {addressId === "new" ? (
                <div className="grid grid-cols-1 gap-4 border border-line p-4 sm:grid-cols-2">
                  <Input
                    id="street_address"
                    label="Street Address"
                    required
                    value={newAddress.street_address}
                    onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                    className="sm:col-span-2"
                  />
                  <Input id="city" label="City" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <Input
                    id="postal_code"
                    label="Postal Code"
                    required
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  />
                  <Input
                    id="country"
                    label="Country"
                    required
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="sm:col-span-2"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="h-fit border border-line bg-cream-soft p-6">
          <h2 className="mb-5 font-display text-xl">Order Summary</h2>
          <ul className="mb-4 space-y-3 border-b border-line pb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between text-xs text-ink-soft">
                <span>
                  {item.product.name} × {item.quantity} ({item.size})
                </span>
                <span className="text-ink">{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mb-6 flex justify-between text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button type="submit" className="w-full" size="lg" loading={checkout.isPending}>
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
