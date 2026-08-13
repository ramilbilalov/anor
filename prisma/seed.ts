import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      restaurantName: "Анор",
      description:
        "Узбекская кухня: ароматный плов, сочный шашлык, наваристые супы и свежая выпечка из тандыра.",
      address: "Ульяновск, проспект Туполева, 22",
      phone: "",
      workingHours: "Ежедневно с 10:20 до 22:30",
      deliveryInfo:
        "Доставка по Ульяновску. Стоимость доставки и минимальную сумму заказа уточняйте у оператора.",
    },
  });

  const plov = await prisma.category.create({
    data: { name: "Плов и горячее", sortOrder: 1 },
  });
  const soups = await prisma.category.create({
    data: { name: "Супы", sortOrder: 2 },
  });
  const bakery = await prisma.category.create({
    data: { name: "Выпечка", sortOrder: 3 },
  });
  const drinks = await prisma.category.create({
    data: { name: "Напитки", sortOrder: 4 },
  });

  await prisma.product.createMany({
    data: [
      {
        categoryId: plov.id,
        name: "Плов по-фергански",
        description: "Классический узбекский плов на костре",
        composition: "Рис девзира, баранина, морковь, лук, зира, чеснок",
        price: 450,
        sortOrder: 1,
      },
      {
        categoryId: plov.id,
        name: "Шашлык из баранины",
        description: "Сочный шашлык на углях",
        composition: "Баранина, лук, специи",
        price: 390,
        sortOrder: 2,
      },
      {
        categoryId: soups.id,
        name: "Лагман",
        description: "Наваристый суп с домашней лапшой",
        composition: "Лапша, говядина, овощи, специи",
        price: 320,
        sortOrder: 1,
      },
      {
        categoryId: soups.id,
        name: "Шурпа",
        description: "Ароматный мясной суп",
        composition: "Баранина, картофель, морковь, зелень",
        price: 300,
        sortOrder: 2,
      },
      {
        categoryId: bakery.id,
        name: "Самса с мясом",
        description: "Слоёная самса из тандыра",
        composition: "Тесто, говядина, лук",
        price: 90,
        sortOrder: 1,
      },
      {
        categoryId: bakery.id,
        name: "Лепёшка тандырная",
        description: "Свежая горячая лепёшка",
        composition: "Мука, вода, дрожжи, кунжут",
        price: 60,
        sortOrder: 2,
      },
      {
        categoryId: drinks.id,
        name: "Чай чёрный (чайник)",
        description: "Классический чёрный чай",
        composition: "Чёрный чай",
        price: 120,
        sortOrder: 1,
      },
      {
        categoryId: drinks.id,
        name: "Айран",
        description: "Освежающий кисломолочный напиток",
        composition: "Кефир, вода, соль",
        price: 90,
        sortOrder: 2,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
