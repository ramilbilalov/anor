import { prisma } from "@/lib/prisma";
import { MenuManager } from "./MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
    },
  });

  return <MenuManager categories={categories} />;
}
