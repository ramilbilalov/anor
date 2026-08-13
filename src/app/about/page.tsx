import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← Назад к меню
        </Link>

        <h1 className="mt-4 text-2xl font-bold">{s.restaurantName}</h1>
        {s.description && <p className="mt-2 text-muted">{s.description}</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {s.address && <InfoCard title="Адрес" icon="📍" text={s.address} />}
          {s.phone && (
            <InfoCard
              title="Телефон"
              icon="📞"
              text={s.phone}
              href={`tel:${s.phone}`}
            />
          )}
          {s.workingHours && (
            <InfoCard title="Часы работы" icon="🕒" text={s.workingHours} />
          )}
          {s.deliveryInfo && (
            <InfoCard title="Доставка" icon="🚚" text={s.deliveryInfo} />
          )}
        </div>

        {!s.address &&
          !s.phone &&
          !s.workingHours &&
          !s.deliveryInfo &&
          !s.description && (
            <p className="mt-6 rounded-xl border border-border bg-card p-6 text-muted">
              Информация о ресторане пока не заполнена.
            </p>
          )}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Перейти в меню
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({
  title,
  icon,
  text,
  href,
}: {
  title: string;
  icon: string;
  text: string;
  href?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {icon} {title}
      </h2>
      {href ? (
        <a href={href} className="mt-1 block text-primary hover:underline">
          {text}
        </a>
      ) : (
        <p className="mt-1 whitespace-pre-line">{text}</p>
      )}
    </div>
  );
}
