import Link from "next/link";
import { getSettings } from "@/lib/settings";

export async function SiteFooter() {
  const s = await getSettings();

  return (
    <footer className="mt-10 border-t border-border bg-card">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold">{s.restaurantName}</h3>
          {s.description && (
            <p className="mt-2 max-w-sm text-sm text-muted">{s.description}</p>
          )}
        </div>

        <div className="space-y-1.5 text-sm sm:text-right">
          {s.address && (
            <p>
              <span className="text-muted">Адрес: </span>
              {s.address}
            </p>
          )}
          {s.phone && (
            <p>
              <span className="text-muted">Телефон: </span>
              <a href={`tel:${s.phone}`} className="text-primary hover:underline">
                {s.phone}
              </a>
            </p>
          )}
          {s.workingHours && (
            <p>
              <span className="text-muted">Часы работы: </span>
              {s.workingHours}
            </p>
          )}
          <p className="pt-2">
            <Link href="/about" className="text-primary hover:underline">
              О ресторане и доставке
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {s.restaurantName}
      </div>
    </footer>
  );
}
