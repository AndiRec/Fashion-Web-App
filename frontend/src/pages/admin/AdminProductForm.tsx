import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeta } from "@/hooks/useMeta";
import { useCreateProduct, useDeleteProductImage, useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { categoryLabel } from "@/lib/format";
import { TrashIcon } from "@/components/icons";

export function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const { data: meta } = useMeta();
  const { data: product, isLoading } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteImage = useDeleteProductImage();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    color: "",
    is_on_sale: false,
    sale_percentage: "",
    new_collection: false,
  });
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        color: product.color,
        is_on_sale: product.is_on_sale,
        sale_percentage: product.discount_percentage ? String(product.discount_percentage) : "",
        new_collection: product.new_collection,
      });
      setSizes(Object.fromEntries(product.variants.map((v) => [v.size, String(v.stock)])));
    }
  }, [product]);

  useEffect(() => {
    if (!isEdit && meta) {
      setSizes((prev) => (Object.keys(prev).length ? prev : Object.fromEntries(meta.sizes.map((s) => [s, "0"]))));
      setForm((prev) => ({ ...prev, category: prev.category || meta.categories[0], color: prev.color || meta.colors[0] }));
    }
  }, [meta, isEdit]);

  if (isEdit && isLoading) return <Spinner className="py-32" />;

  function buildFormData() {
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("color", form.color);
    data.append("is_on_sale", form.is_on_sale ? "1" : "0");
    if (form.is_on_sale) data.append("sale_percentage", form.sale_percentage);
    data.append("new_collection", form.new_collection ? "1" : "0");
    Object.entries(sizes).forEach(([size, stock]) => data.append(`sizes[${size}]`, stock || "0"));
    if (images) Array.from(images).forEach((file) => data.append("images[]", file));
    return data;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = buildFormData();
    const onSuccess = () => {
      push(isEdit ? "Product updated." : "Product created.");
      navigate("/admin/products");
    };
    const onError = (err: unknown) => push(getErrorMessage(err), "error");

    if (isEdit) {
      updateProduct.mutate({ id: Number(id), formData }, { onSuccess, onError });
    } else {
      createProduct.mutate(formData, { onSuccess, onError });
    }
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input id="name" label="Product Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="sm:col-span-2" />
          <Textarea
            id="description"
            label="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2"
          />
          <Input id="price" type="number" label="Price (ден.)" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Select id="category" label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {meta?.categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </Select>
          <Select id="color" label="Color" required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
            {meta?.colors.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.new_collection}
              onChange={(e) => setForm({ ...form, new_collection: e.target.checked })}
              className="h-4 w-4 accent-ink"
            />
            New Collection
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.is_on_sale}
              onChange={(e) => setForm({ ...form, is_on_sale: e.target.checked })}
              className="h-4 w-4 accent-ink"
            />
            On Sale
          </label>
          {form.is_on_sale ? (
            <Input
              id="sale_percentage"
              type="number"
              label="Discount %"
              min={1}
              max={90}
              value={form.sale_percentage}
              onChange={(e) => setForm({ ...form, sale_percentage: e.target.value })}
              className="w-32"
            />
          ) : null}
        </div>

        <div>
          <h3 className="eyebrow mb-3">Stock by Size</h3>
          <div className="grid grid-cols-5 gap-3">
            {meta?.sizes.map((size) => (
              <div key={size}>
                <label className="mb-1 block text-xs text-ink-soft">{size}</label>
                <input
                  type="number"
                  min={0}
                  value={sizes[size] ?? ""}
                  onChange={(e) => setSizes({ ...sizes, [size]: e.target.value })}
                  className="w-full border border-line bg-cream-soft px-2 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {isEdit && product && product.images.length > 0 ? (
          <div>
            <h3 className="eyebrow mb-3">Current Images</h3>
            <div className="flex flex-wrap gap-3">
              {product.images.map((image) => (
                <div key={image.id} className="relative h-24 w-20">
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage.mutate(
                        { productId: product.id, imageId: image.id },
                        { onError: (err) => push(getErrorMessage(err), "error") },
                      )
                    }
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream"
                  >
                    <TrashIcon width={12} height={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
            {isEdit ? "Add More Images" : "Images"}
          </label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="text-sm" />
        </div>

        <Button type="submit" size="lg" loading={createProduct.isPending || updateProduct.isPending}>
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </AdminLayout>
  );
}
