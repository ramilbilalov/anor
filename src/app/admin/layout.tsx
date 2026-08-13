"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/menu", label: "Меню" },
  { href: "/admin/settings", label: "Настройки" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // The login page renders standalone, without the admin chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold">Админ-панель</span>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="whitespace-nowrap text-sm text-muted hover:text-primary"
              >
                На сайт ↗
              </Link>
              <button
                type="button"
                onClick={logout}
                className="whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
              >
                Выйти
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-background"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
