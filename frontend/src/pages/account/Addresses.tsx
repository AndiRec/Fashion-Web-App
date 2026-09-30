import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from "@/hooks/useAddresses";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { TrashIcon } from "@/components/icons";

const emptyForm = { street_address: "", city: "", postal_code: "", country: "" };

export function Addresses() {
  const { t } = useTranslation();
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const push = useToastStore((s) => s.push);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function startEdit(address: { id: number; street_address: string; city: string; postal_code: string; country: string }) {
    setEditingId(address.id);
    setForm({ street_address: address.street_address, city: address.city, postal_code: address.postal_code, country: address.country });
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const onSuccess = () => {
      push(editingId ? t("account.addresses.addressUpdated") : t("account.addresses.addressAdded"));
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    };
    const onError = (err: unknown) => push(getErrorMessage(err), "error");

    if (editingId) {
      updateAddress.mutate({ id: editingId, ...form }, { onSuccess, onError });
    } else {
      createAddress.mutate(form, { onSuccess, onError });
    }
  }

  return (
    <AccountLayout>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-8">
          {!addresses || addresses.length === 0 ? (
            !showForm && <EmptyState title={t("account.addresses.emptyTitle")} description={t("account.addresses.emptyDescription")} />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <li key={address.id} className="border border-line p-4 text-sm">
                  <p className="text-ink">{address.street_address}</p>
                  <p className="text-ink-soft">
                    {address.city}, {address.postal_code}
                  </p>
                  <p className="text-ink-soft">{address.country}</p>
                  <div className="mt-3 flex gap-4">
                    <button onClick={() => startEdit(address)} className="link-underline text-xs text-ink-soft">
                      {t("account.addresses.edit")}
                    </button>
                    <button
                      onClick={() =>
                        deleteAddress.mutate(address.id, { onError: (err) => push(getErrorMessage(err), "error") })
                      }
                      className="flex items-center gap-1 text-xs text-ink-soft hover:text-rust"
                    >
                      <TrashIcon width={12} height={12} /> {t("account.addresses.delete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {showForm ? (
            <form onSubmit={handleSubmit} className="grid max-w-lg grid-cols-1 gap-4 border border-line p-6 sm:grid-cols-2">
              <Input
                id="street_address"
                label={t("account.addresses.streetAddress")}
                required
                value={form.street_address}
                onChange={(e) => setForm({ ...form, street_address: e.target.value })}
                className="sm:col-span-2"
              />
              <Input id="city" label={t("account.addresses.city")} required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input
                id="postal_code"
                label={t("account.addresses.postalCode")}
                required
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
              />
              <Input
                id="country"
                label={t("account.addresses.country")}
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="sm:col-span-2"
              />
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" loading={createAddress.isPending || updateAddress.isPending}>
                  {editingId ? t("account.addresses.updateAddress") : t("account.addresses.saveAddress")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  {t("account.addresses.cancel")}
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setShowForm(true)}>
              {t("account.addresses.addNewAddress")}
            </Button>
          )}
        </div>
      )}
    </AccountLayout>
  );
}
