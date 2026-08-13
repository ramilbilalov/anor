import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    getSettings(),
  ]);

  const hasProducts = categories.some((c) => c.products.length > 0);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-orange-400 px-6 py-8 text-primary-foreground">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {settings.restaurantName}
          </h1>
          <p className="mt-1 max-w-lg text-sm text-white/90">
            {settings.description ||
              "Выберите блюда, добавьте в корзину и оформите доставку — мы привезём заказ по указанному адресу."}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/90">
            {settings.address && <span>📍 {settings.address}</span>}
            {settings.workingHours && <span>🕒 {settings.workingHours}</span>}
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="hover:underline">
                📞 {settings.phone}
              </a>
            )}
          </div>
        </section>

        {!hasProducts && (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-muted">
            Меню пока пустое. Загляните позже.
          </p>
        )}

        {categories.map((category) =>
          category.products.length === 0 ? null : (
            <section key={category.id} className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">{category.name}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.products.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <Link href={`/product/${product.id}`}>
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4">
                        <p className="mb-2 flex items-baseline gap-2 text-lg font-semibold">
                          {formatPrice(product.price)}
                          {product.weight && (
                            <span className="text-sm font-normal text-muted">
                              {product.weight}
                            </span>
                          )}
                        </p>
                        <AddToCartButton
                          product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function ProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center bg-orange-50 text-4xl">
        🍽️
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/3] w-full object-cover"
    />
  );
}
