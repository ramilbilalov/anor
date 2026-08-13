import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Политика конфиденциальности",
};

export default async function PrivacyPage() {
  const s = await getSettings();
  const ph = (v: string, placeholder: string) => v || placeholder;
  const operator = ph(s.legalName, "[укажите реквизиты в админ-панели]");
  const email = ph(s.legalEmail, "[укажите email в админ-панели]");

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← На главную
        </Link>
        <article className="prose-legal mt-4 space-y-4 text-sm leading-relaxed">
          <h1 className="text-2xl font-bold">
            Политика в отношении обработки персональных данных
          </h1>
          <p className="text-muted">
            Действует для сайта доставки «{s.restaurantName}».
          </p>

          <h2 className="pt-2 text-lg font-semibold">1. Общие положения</h2>
          <p>
            Настоящая Политика определяет порядок обработки и защиты персональных
            данных пользователей сайта и разработана в соответствии с
            Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».
          </p>

          <h2 className="pt-2 text-lg font-semibold">2. Оператор</h2>
          <p>
            Оператором персональных данных является {operator}
            {s.inn ? `, ИНН ${s.inn}` : ""}
            {s.ogrnip ? `, ОГРНИП/ОГРН ${s.ogrnip}` : ""}
            {s.address ? `, адрес: ${s.address}` : ""}. Контакт для обращений по
            вопросам обработки персональных данных: {email}.
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            3. Какие данные обрабатываются
          </h2>
          <p>
            При оформлении заказа обрабатываются: имя, номер телефона, адрес
            доставки, а также комментарий к заказу (если указан). Специальные
            категории персональных данных не собираются.
          </p>

          <h2 className="pt-2 text-lg font-semibold">4. Цели обработки</h2>
          <p>
            Данные обрабатываются с целью приёма, подтверждения и доставки
            заказа, связи с клиентом по заказу, а также выполнения требований
            законодательства.
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            5. Правовые основания обработки
          </h2>
          <p>
            Обработка осуществляется на основании согласия субъекта персональных
            данных, выражаемого при оформлении заказа, а также для исполнения
            договора, стороной которого является субъект.
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            6. Передача данных третьим лицам
          </h2>
          <p>
            Данные могут передаваться курьерам и службам доставки исключительно в
            объёме, необходимом для доставки заказа. Оператор не передаёт данные
            третьим лицам в иных целях без согласия субъекта, кроме случаев,
            предусмотренных законом.
          </p>

          <h2 className="pt-2 text-lg font-semibold">
            7. Хранение и защита данных
          </h2>
          <p>
            Персональные данные хранятся на серверах, расположенных на территории
            Российской Федерации, в течение срока, необходимого для достижения
            целей обработки, если иной срок не установлен законом. Оператор
            принимает необходимые организационные и технические меры для защиты
            данных от неправомерного доступа.
          </p>

          <h2 className="pt-2 text-lg font-semibold">8. Права пользователя</h2>
          <p>
            Пользователь вправе получить информацию об обработке своих данных,
            требовать их уточнения, блокирования или удаления, а также отозвать
            согласие на обработку, направив обращение на {email}.
          </p>

          <h2 className="pt-2 text-lg font-semibold">9. Изменения Политики</h2>
          <p>
            Оператор вправе изменять настоящую Политику. Актуальная редакция
            всегда доступна на данной странице.
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
