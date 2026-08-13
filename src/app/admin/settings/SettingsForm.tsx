"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RestaurantSettings } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: RestaurantSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<RestaurantSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof RestaurantSettings>(
    key: K,
    value: RestaurantSettings[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Ошибка сохранения");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Информация о ресторане</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <Field
          label="Название ресторана *"
          value={form.restaurantName}
          onChange={(v) => update("restaurantName", v)}
          required
        />
        <TextArea
          label="Описание"
          value={form.description}
          onChange={(v) => update("description", v)}
          placeholder="Короткий текст о кухне и заведении"
        />
        <Field
          label="Адрес"
          value={form.address}
          onChange={(v) => update("address", v)}
          placeholder="Город, улица, дом"
        />
        <Field
          label="Телефон"
          value={form.phone}
          onChange={(v) => update("phone", v)}
          placeholder="+7 900 000-00-00"
          type="tel"
        />
        <Field
          label="Часы работы"
          value={form.workingHours}
          onChange={(v) => update("workingHours", v)}
          placeholder="Ежедневно с 10:00 до 22:00"
        />
        <TextArea
          label="Условия доставки"
          value={form.deliveryInfo}
          onChange={(v) => update("deliveryInfo", v)}
          placeholder="Зона доставки, стоимость, минимальный заказ"
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {saved && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Сохранено ✓
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </div>
  );
}
