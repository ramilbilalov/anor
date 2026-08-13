"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description: string;
  composition: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  products: Product[];
};

type EditorState =
  | { mode: "closed" }
  | { mode: "new"; categoryId: string }
  | { mode: "edit"; product: Product };

export function MenuManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const [busy, setBusy] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setBusy(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategory,
        sortOrder: categories.length + 1,
      }),
    });
    setNewCategory("");
    setBusy(false);
    router.refresh();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Удалить категорию вместе со всеми блюдами?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Удалить блюдо?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function toggleAvailable(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Управление меню</h1>
      </div>

      <form
        onSubmit={addCategory}
        className="mb-8 flex gap-2 rounded-xl border border-border bg-card p-4"
      >
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Новая категория"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
        >
          Добавить категорию
        </button>
      </form>

      {categories.length === 0 && (
        <p className="text-muted">Категорий пока нет. Добавьте первую выше.</p>
      )}

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditor({ mode: "new", categoryId: category.id })
                  }
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
                >
                  + Блюдо
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-red-600"
                >
                  Удалить категорию
                </button>
              </div>
            </div>

            {category.products.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">
                В категории пока нет блюд.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <tbody>
                    {category.products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="w-16 p-2">
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="grid h-12 w-12 place-items-center rounded-lg bg-orange-50 text-xl">
                              🍽️
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{product.name}</div>
                          <div className="line-clamp-1 text-muted">
                            {product.description}
                          </div>
                        </td>
                        <td className="whitespace-nowrap p-2 font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => toggleAvailable(product)}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              product.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-border text-muted"
                            }`}
                          >
                            {product.isAvailable ? "В наличии" : "Скрыто"}
                          </button>
                        </td>
                        <td className="whitespace-nowrap p-2 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setEditor({ mode: "edit", product })
                            }
                            className="mr-2 text-primary hover:underline"
                          >
                            Изменить
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="text-muted hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {editor.mode !== "closed" && (
        <ProductEditor
          categories={categories}
          state={editor}
          onClose={() => setEditor({ mode: "closed" })}
          onSaved={() => {
            setEditor({ mode: "closed" });
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  categories,
  state,
  onClose,
  onSaved,
}: {
  categories: Category[];
  state: Exclude<EditorState, { mode: "closed" }>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = state.mode === "edit" ? state.product : null;
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    categoryId:
      editing?.categoryId ??
      (state.mode === "new" ? state.categoryId : undefined) ??
      categories[0]?.id ??
      "",
    price: editing ? String(editing.price) : "",
    description: editing?.description ?? "",
    composition: editing?.composition ?? "",
    imageUrl: editing?.imageUrl ?? "",
    isAvailable: editing?.isAvailable ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Ошибка загрузки");
      return;
    }
    update("imageUrl", data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      price: Number(form.price) || 0,
      description: form.description,
      composition: form.composition,
      imageUrl: form.imageUrl || null,
      isAvailable: form.isAvailable,
    };
    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Ошибка сохранения");
      return;
    }
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-bold">
          {editing ? "Редактировать блюдо" : "Новое блюдо"}
        </h2>

        <div>
          <label className="mb-1 block text-sm font-medium">Название *</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Категория *</label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Цена (₽) *</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Описание</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Состав</label>
          <textarea
            value={form.composition}
            onChange={(e) => update("composition", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Фотография</label>
          <div className="flex items-center gap-3">
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt=""
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-orange-50 text-2xl">
                🍽️
              </div>
            )}
            <div className="flex flex-col gap-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                className="text-sm"
              />
              {uploading ? (
                <span className="text-xs text-muted">Загрузка…</span>
              ) : (
                <span className="text-xs text-muted">
                  Любое фото — обрежется в квадрат и сожмётся автоматически
                </span>
              )}
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => update("imageUrl", "")}
                  className="text-left text-xs text-muted hover:text-red-600"
                >
                  Удалить фото
                </button>
              )}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => update("isAvailable", e.target.checked)}
          />
          Показывать в меню (в наличии)
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-background"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
