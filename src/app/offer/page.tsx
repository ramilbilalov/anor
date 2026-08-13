import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Пользовательское соглашение и оферта",
};

export default async function OfferPage() {
  const s = await getSettings();
  const ph = (v: string, placeholder: string) => v || placeholder;
  const seller = ph(s.legalName, "[укажите реквизиты в админ-панели]");

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← На главную
        </Link>
        <article className="mt-4 space-y-4 text-sm leading-relaxed">
          <h1 className="text-2xl font-bold">
            Пользовательское соглашение и публичная оферта
          </h1>
          <p className="text-muted">
            Сайт доставки «{s.restaurantName}».
          </p>

          <h2 className="pt-2 text-lg font-semibold">1. Общие положения</h2>
          <p>
            Настоящий документ является публичной офертой. Оформляя заказ на
            сайте, пользователь (далее — Покупатель) принимает условия настоящего
            соглашения в полном объёме. Продавец: {seller}
            {s.inn ? `, ИНН ${s.inn}` : ""}
            {s.ogrnip ? `, ОГРНИП/ОГРН ${s.ogrnip}` : ""}.
          </p>

          <h2 className="pt-2 text-lg font-semibold">2. Предмет</h2>
          <p>
            Продавец обязуется передать Покупателю блюда и напитки согласно
            оформленному заказу, а Покупатель — принять и оплатить их на условиях
            настоящего соглашения.
          </p>

          <h2 className="pt-2 text-lg font-semibold">3. Оформление заказа</h2>
          <p>
            Заказ оформляется на сайте путём добавления блюд в корзину и указания
            контактных данных и адреса доставки. Покупатель несёт ответственность
            за достоверность предоставленных данных.
          </p>

          <h2 className="pt-2 text-lg font-semibold">4. Цена и оплата</h2>
          <p>
            Цены на блюда указаны на сайте в рублях. Оплата производится при
            получении заказа (наличными или картой курьеру), если иное не
            согласовано отдельно.
          </p>

          <h2 className="pt-2 text-lg font-semibold">5. Доставка</h2>
          <p>
            {s.deliveryInfo ||
              "Условия и зона доставки уточняются у оператора при подтверждении заказа."}
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            6. Отмена и возврат
          </h2>
          <p>
            Покупатель вправе отменить заказ до его передачи в доставку. Возврат
            денежных средств за продукты надлежащего качества, имеющие
            индивидуально-определённые свойства (готовые блюда), осуществляется в
            соответствии с законодательством РФ. По вопросам качества заказа
            обращайтесь по телефону {s.phone || "[укажите телефон в настройках]"}.
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            7. Персональные данные
          </h2>
          <p>
            Обработка персональных данных осуществляется в соответствии с{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Политикой конфиденциальности
            </Link>
            .
          </p>

          <h2 className="pt-2 text-lg font-semibold">8. Реквизиты продавца</h2>
          <p>
            {seller}
            {s.inn ? `, ИНН ${s.inn}` : ""}
            {s.ogrnip ? `, ОГРНИП/ОГРН ${s.ogrnip}` : ""}
            {s.address ? `, адрес: ${s.address}` : ""}
            {s.phone ? `, тел.: ${s.phone}` : ""}.
          </p>

          <p className="pt-4 text-muted">
            Дата последнего обновления:{" "}
            {new Date().toLocaleDateString("ru-RU")}
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
