import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// Full Anor menu (from eda.yandex.ru). Descriptions/composition are left empty
// for the admin to fill in; weight and price come from the source menu.
const MENU: {
  category: string;
  items: { name: string; weight: string; price: number }[];
}[] = [
  {
    category: "Салаты",
    items: [{ name: "Салат Лансай", weight: "150 г", price: 331 }],
  },
  {
    category: "Закуски",
    items: [
      { name: "Казы узбекские", weight: "100 г", price: 482 },
      { name: "Сузма по Самаркандски", weight: "120 г", price: 345 },
      { name: "Яхна тил", weight: "100 г", price: 524 },
      { name: "Сырная тарелка", weight: "150 г", price: 496 },
      { name: "Овощное ассорти", weight: "150 г", price: 413 },
      { name: "Нишона", weight: "150 г", price: 455 },
      { name: "Мясное ассорти", weight: "200 г", price: 537 },
      { name: "Соленья", weight: "150 г", price: 427 },
      { name: "Ассорти из молодой зелени", weight: "150 г", price: 413 },
    ],
  },
  {
    category: "Супы",
    items: [
      { name: "Борщ", weight: "300 г", price: 345 },
      { name: "Мастава", weight: "300 г", price: 400 },
      { name: "Кайнатма шурпа", weight: "300 г", price: 303 },
      { name: "Куза шурпа с говядины", weight: "300 г", price: 455 },
      { name: "Куза шурпа с баранины", weight: "300 г", price: 482 },
      { name: "Чучвара шурпа", weight: "300 г", price: 400 },
      { name: "Угра ош", weight: "300 г", price: 372 },
      { name: "Лагман по Домашнему", weight: "300 г", price: 413 },
      { name: "Лагман по Уйгурски", weight: "300 г", price: 413 },
    ],
  },
  {
    category: "Шашлык & Гриль",
    items: [
      { name: "Шашлык из курицы", weight: "150 г", price: 413 },
      { name: "Люля кебаб из курицы", weight: "150 г", price: 276 },
      { name: "Люля кебаб из баранины", weight: "150 г", price: 345 },
      { name: "Люля кебаб из говядины", weight: "150 г", price: 303 },
      { name: "Сырный люля из говядины", weight: "150 г", price: 371 },
      { name: "Сырный люля из баранины", weight: "150 г", price: 374 },
      { name: "Парвоз кабоб", weight: "150 г", price: 413 },
      { name: "Чигатой кабоб", weight: "150 г", price: 510 },
      { name: "Махсус кабоб", weight: "150 г", price: 482 },
      { name: "Кавургали кебаб", weight: "150 г", price: 483 },
      { name: "Корейка ягненка", weight: "150 г", price: 689 },
      { name: "Сабзавод", weight: "150 г", price: 386 },
      { name: "Грибы на мангале", weight: "120 г", price: 304 },
      { name: "Картофель на мангале", weight: "120 г", price: 248 },
      { name: "Жужа на мангале", weight: "700 г", price: 592 },
      { name: "Дорадо на мангале", weight: "350 г", price: 758 },
      { name: "Сибас на мангале", weight: "350 г", price: 827 },
      { name: "Шашлык из сёмги", weight: "150 г", price: 551 },
      { name: "Мясное ассорти", weight: "2 кг", price: 6254 },
    ],
  },
  {
    category: "Горячие блюда",
    items: [
      { name: "Манты", weight: "250 г", price: 345 },
      { name: "Сай из Курицы", weight: "300 г", price: 524 },
      { name: "Балык сай", weight: "250 г", price: 551 },
      { name: "Плов от шефа", weight: "350 г", price: 482 },
      { name: "Плов от Шефа (на компанию)", weight: "1 кг", price: 1484 },
      { name: "Чайхана плов", weight: "300 г", price: 413 },
      { name: "Силтама", weight: "330 г", price: 551 },
      { name: "Жаркое из баранины с овощами", weight: "300 г", price: 620 },
      { name: "Жужа табака", weight: "700 г", price: 620 },
      { name: "Казан кебаб (говядина)", weight: "400 г", price: 427 },
      { name: "Казан кебаб (баранина)", weight: "400 г", price: 482 },
      { name: "Казан-долма", weight: "300 г", price: 482 },
      { name: "Котлеты по-бухарски", weight: "200 г", price: 468 },
      { name: "Курма лагмон", weight: "250 г", price: 413 },
      { name: "Курутоб с мясом", weight: "450 г", price: 413 },
    ],
  },
  {
    category: "Гарниры",
    items: [
      { name: "Картофель фри", weight: "100 г", price: 220 },
      { name: "Рис Ташкентский огненный", weight: "100 г", price: 220 },
    ],
  },
  {
    category: "Выпечка",
    items: [
      { name: "Самса из тандыра без соуса", weight: "190 г", price: 165 },
      { name: "Мехмон нон", weight: "90 г", price: 68 },
    ],
  },
  {
    category: "Десерты",
    items: [
      { name: "Фруктовая ваза", weight: "500 г", price: 675 },
      { name: "Пахлава Узбекская", weight: "175 г", price: 345 },
      { name: "Медовик", weight: "180 г", price: 318 },
    ],
  },
  {
    category: "Напитки",
    items: [
      { name: "Айрон", weight: "300 г", price: 95 },
      { name: "Шарбат из кураги", weight: "300 мл", price: 136 },
      { name: "Шарбат из вишни", weight: "300 мл", price: 136 },
      { name: "Сок Добрый Яблоко", weight: "1 л", price: 200 },
      { name: "Сок Добрый Апельсин", weight: "1 л", price: 200 },
      { name: "Добрый Кола", weight: "1 л", price: 200 },
      { name: "Натахтари со вкусом барбариса", weight: "500 мл", price: 200 },
    ],
  },
  {
    category: "Соусы",
    items: [
      { name: "Соус Сырный", weight: "30 г", price: 70 },
      { name: "Соус Сметана", weight: "30 г", price: 70 },
      { name: "Аджика", weight: "30 г", price: 70 },
      { name: "Соус кетчуп", weight: "30 г", price: 70 },
      { name: "Соус майонез", weight: "30 г", price: 70 },
      { name: "Соус томатный", weight: "30 г", price: 70 },
    ],
  },
];

async function main() {
  // Refresh the menu without touching orders. Deleting products sets
  // OrderItem.productId to null (onDelete: SetNull), so order history is kept.
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

  for (let c = 0; c < MENU.length; c++) {
    const block = MENU[c];
    const category = await prisma.category.create({
      data: { name: block.category, sortOrder: c + 1 },
    });
    await prisma.product.createMany({
      data: block.items.map((item, i) => ({
        categoryId: category.id,
        name: item.name,
        weight: item.weight,
        price: item.price,
        sortOrder: i + 1,
      })),
    });
  }

  const count = await prisma.product.count();
  console.log(`Seed complete: ${MENU.length} categories, ${count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
