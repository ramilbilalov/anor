import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Header } from "@/components/Header";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← Назад к меню
        </Link>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center bg-orange-50 text-6xl">
                🍽️
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-primary">{product.category.name}</span>
            <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
            {product.weight && (
              <p className="mt-1 text-sm text-muted">{product.weight}</p>
            )}

            {product.description && (
              <p className="mt-3 text-muted">{product.description}</p>
            )}

            {product.composition && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Состав
                </h2>
                <p className="mt-1">{product.composition}</p>
              </div>
            )}

            <div className="mt-auto pt-6">
              <p className="mb-3 text-2xl font-bold">
                {formatPrice(product.price)}
              </p>
              {product.isAvailable ? (
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  }}
                />
              ) : (
                <p className="rounded-lg bg-border/50 px-4 py-2 text-center text-sm text-muted">
                  Нет в наличии
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
