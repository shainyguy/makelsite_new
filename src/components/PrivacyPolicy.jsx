export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Политика конфиденциальности</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 mb-6">
          <strong>Дата вступления в силу:</strong> 01.03.2025 г.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Общие положения</h2>
        <p className="text-slate-600 mb-4">
          Настоящая Политика конфиденциальности регулирует обработку персональных данных в соответствии с Федеральным законом 
          № 152-ФЗ "О персональных данных" от 27.07.2006 г. (далее — "Закон") 
          и применяется ко всей информации, которую Оператор сайта может получить 
          о Пользователе во время использования сайта.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Оператор персональных данных</h2>
        <p className="text-slate-600 mb-4">
          <strong>Оператор:</strong> ООО "МАКЕЛ РУС"<br/>
          <strong>ИНН:</strong> 7701234567<br/>
          <strong>Адрес:</strong> 123456, г. Москва, ул. Примерная, д. 1<br/>
          <strong>Телефон:</strong> 8 (800) 123-45-67<br/>
          <strong>Email:</strong> privacy@makel.ru
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Какие данные мы собираем</h2>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>ФИО, контактный телефон, email (при отправке форм)</li>
          <li>Название компании (если указано)</li>
          <li>IP-адрес, дата и время визита</li>
          <li>Cookie-файлы (с согласия пользователя)</li>
          <li>Данные о браузере и устройстве</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Цели обработки данных</h2>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>Обработка заявок и консультаций</li>
          <li>Отправка коммерческих предложений (с согласия)</li>
          <li>Улучшение работы сайта</li>
          <li>Исполнение требований законодательства</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Права субъекта персональных данных</h2>
        <p className="text-slate-600 mb-4">
          Вы имеете право на доступ, уточнение, блокирование и удаление ваших персональных данных, 
          а также на отзыв согласия на обработку. Для этого обратитесь по адресу privacy@makel.ru.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Cookies</h2>
        <p className="text-slate-600 mb-4">
          Мы используем технические cookies для корректной работы сайта и аналитические cookies 
          для улучшения пользовательского опыта. Вы можете отказаться от аналитических cookies 
          в настройках браузера.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Сроки хранения</h2>
        <p className="text-slate-600 mb-4">
          Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, 
          но не более 3 лет с момента последнего взаимодействия.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Контакты</h2>
        <p className="text-slate-600 mb-4">
          По всем вопросам, связанным с обработкой персональных данных, обращайтесь по адресу: 
          <a href="mailto:privacy@makel.ru" className="text-red-600 hover:underline">privacy@makel.ru</a>
        </p>
      </div>
    </div>
  );
}
