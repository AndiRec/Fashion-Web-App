import { type ChangeEvent, type DragEvent, type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMeta } from "@/hooks/useMeta";
import { useCreateProduct, useDeleteProductImage, useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { categoryLabel } from "@/lib/format";
import { TrashIcon, UploadIcon } from "@/components/icons";
import type { ProductImage } from "@/lib/types";

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border border-line bg-cream p-6">
    <h2 className="mb-5 font-display text-lg text-ink">{title}</h2>
    {children}
  </div>
);

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
    is_on_sale: false,
    sale_percentage: "",
    new_collection: false,
  });
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [pendingImageDelete, setPendingImageDelete] = useState<ProductImage | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
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
      setForm((prev) => ({ ...prev, category: prev.category || meta.categories[0] }));
    }
  }, [meta, isEdit]);

  const previewUrls = useMemo(() => newFiles.map((file) => URL.createObjectURL(file)), [newFiles]);
  useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

  if (isEdit && isLoading) return <Spinner className="min-h-screen" />;

  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    const tooBig = files.filter((f) => f.size > MAX_IMAGE_BYTES);
    const ok = files.filter((f) => f.size <= MAX_IMAGE_BYTES);
    if (tooBig.length > 0) {
      push(`${tooBig.map((f) => f.name).join(", ")} — over 10MB, not added.`, "error");
    }
    if (ok.length > 0) {
      setNewFiles((prev) => [...prev, ...ok]);
    }
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  function buildFormData() {
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("is_on_sale", form.is_on_sale ? "1" : "0");
    if (form.is_on_sale) data.append("sale_percentage", form.sale_percentage);
    data.append("new_collection", form.new_collection ? "1" : "0");
    Object.entries(sizes).forEach(([size, stock]) => data.append(`sizes[${size}]`, stock || "0"));
    newFiles.forEach((file) => data.append("images[]", file));
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

  function confirmImageDelete() {
    if (!pendingImageDelete || !product) return;
    deleteImage.mutate(
      { productId: product.id, imageId: pendingImageDelete.id },
      {
        onSuccess: () => {
          push("Image removed.");
          setPendingImageDelete(null);
        },
        onError: (err) => {
          push(getErrorMessage(err), "error");
          setPendingImageDelete(null);
        },
      },
    );
  }

  const saving = createProduct.isPending || updateProduct.isPending;

  return (
    <AdminLayout title={isEdit ? "Edit Product" : "Add Product"}>
      <BackButton fallback="/admin/products" label="Back to Products" className="mb-6" />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-24">
        <SectionCard title="Details">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="name"
              label="Product Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="sm:col-span-2"
            />
            <Textarea
              id="description"
              label="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              id="price"
              type="number"
              label="Price (ден.)"
              required
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Select id="category" label="Category" required value={form.category} onChange={(v) => setForm({ ...form, category: v })}>
              {meta?.categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </Select>
          </div>
        </SectionCard>

        <SectionCard title="Merchandising">
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
        </SectionCard>

        <SectionCard title="Stock by Size">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
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
        </SectionCard>

        <SectionCard title="Images">
          {isEdit && product && product.images.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-3">
              {product.images.map((image) => (
                <div key={image.id} className="group relative h-28 w-24 flex-shrink-0">
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPendingImageDelete(image)}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-cream opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <TrashIcon width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {newFiles.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-3">
              {newFiles.map((_, i) => (
                <div key={i} className="group relative h-28 w-24 flex-shrink-0">
                  <img src={previewUrls[i]} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-cream opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <TrashIcon width={13} height={13} />
                  </button>
                  <span className="absolute inset-x-0 bottom-0 truncate bg-ink/70 px-1.5 py-0.5 text-[10px] text-cream">
                    New
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors ${
              dragActive ? "border-ink bg-mist" : "border-line hover:border-ink/40"
            }`}
          >
            <UploadIcon width={22} height={22} className="text-ink-soft" />
            <p className="text-sm text-ink-soft">
              <span className="text-ink underline">Choose files</span> or drag and drop
            </p>
            <p className="text-xs text-ink-soft/70">PNG or JPG, up to 10MB each</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
            />
          </label>
        </SectionCard>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" loading={saving}>
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>

      <ConfirmDialog
        open={!!pendingImageDelete}
        title="Remove this image?"
        description="This image will be permanently deleted from the product."
        confirmLabel="Remove Image"
        loading={deleteImage.isPending}
        onConfirm={confirmImageDelete}
        onCancel={() => setPendingImageDelete(null)}
      />
    </AdminLayout>
  );
}
