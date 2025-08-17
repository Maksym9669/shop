import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Про наш магазин
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Ваш надійний партнер в світі якісних товарів
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Наша історія
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Наш магазин почав свою діяльність з простої ідеї - надавати
                клієнтам доступ до якісних товарів за справедливими цінами. Ми
                віримо, що кожен заслуговує на найкраще, незалежно від бюджету.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Протягом років ми створили міцні відносини з постачальниками, що
                дозволяє нам пропонувати широкий асортимент товарів високої
                якості за конкурентними цінами.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Сьогодні ми продовжуємо розвиватися, впроваджуючи нові
                технології та покращуючи сервіс, щоб зробити ваші покупки
                максимально зручними та приємними.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  2020
                </div>
                <p className="text-gray-600 mb-4">Рік заснування</p>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  10,000+
                </div>
                <p className="text-gray-600 mb-4">Задоволених клієнтів</p>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <p className="text-gray-600">Товарів в асортименті</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Наші цінності
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Якість</h3>
              <p className="text-gray-600">
                Ми ретельно відбираємо кожен товар, гарантуючи високу якість та
                довговічність всіх продуктів у нашому асортименті.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Довіра</h3>
              <p className="text-gray-600">
                Прозорість у роботі, чесні ціни та надійний сервіс - основа
                довірчих відносин з нашими клієнтами.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Інновації
              </h3>
              <p className="text-gray-600">
                Ми постійно вдосконалюємо наш сервіс, впроваджуючи сучасні
                технології для максимального комфорту наших клієнтів.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Що ми пропонуємо
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    📦
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Швидка доставка
                    </h3>
                    <p className="text-gray-600">
                      Доставляємо замовлення протягом 1-3 робочих днів по всій
                      Україні
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    💳
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Зручна оплата
                    </h3>
                    <p className="text-gray-600">
                      Приймаємо оплату картою, готівкою при отриманні та LiqPay
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    🔄
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Гарантія повернення
                    </h3>
                    <p className="text-gray-600">
                      14 днів на повернення товару без пояснення причин
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Персональний підхід
                    </h3>
                    <p className="text-gray-600">
                      Допомагаємо підібрати товари відповідно до ваших потреб
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Підтримка 24/7
                    </h3>
                    <p className="text-gray-600">
                      Наша команда готова відповісти на ваші запитання в
                      будь-який час
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    ⭐
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Програма лояльності
                    </h3>
                    <p className="text-gray-600">
                      Накопичуйте бонуси та отримуйте знижки на майбутні покупки
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Наша команда
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px]">
              <Image
                src="https://shop-app-images-35.s3.us-east-1.amazonaws.com/avatars/avatar-3.png"
                alt={"Avatar-3"}
                width={80}
                height={80}
                className="object-contain rounded mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Олексій Мельник
              </h3>
              <p className="text-blue-600 mb-3">Засновник та CEO</p>
              <p className="text-gray-600 text-sm">
                Візіонер компанії з 15-річним досвідом в e-commerce та
                роздрібній торгівлі
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px]">
              <Image
                src="https://shop-app-images-35.s3.us-east-1.amazonaws.com/avatars/avatar-2.png"
                alt={"Avatar-2"}
                width={80}
                height={80}
                className="object-contain rounded mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Марія Коваленко
              </h3>
              <p className="text-blue-600 mb-3">Директор з маркетингу</p>
              <p className="text-gray-600 text-sm">
                Експерт з цифрового маркетингу, відповідає за стратегію
                просування бренду
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px]">
              <Image
                src="https://shop-app-images-35.s3.us-east-1.amazonaws.com/avatars/avatar-1.png"
                alt={"Avatar-1"}
                width={80}
                height={80}
                className="object-contain rounded mx-auto mb-4"
              />

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Віктор Петренко
              </h3>
              <p className="text-blue-600 mb-3">Керівник логістики</p>
              <p className="text-gray-600 text-sm">
                Забезпечує швидку та надійну доставку товарів по всій території
                України
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Готові розпочати покупки?</h2>
          <p className="text-xl mb-8 opacity-90">
            Ознайомтеся з нашим асортиментом або зв'яжіться з нами для
            консультації
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Переглянути каталог
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Зв'язатися з нами
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
