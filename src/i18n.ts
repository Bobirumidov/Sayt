import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      "nav": {
        "home": "Bosh sahifa", "company": "Kompaniya", "activities": "Faoliyat yo'nalishlari",
        "equipment": "Texnika va uskunalar", "projects": "Loyihalar", "news": "Yangiliklar",
        "vacancies": "Vakansiyalar", "contact": "Bog'lanish", "contact_us": "Biz bilan bog'lanish"
      },
      "hero": {
        "title": "Zamonaviy burg‘ilash texnologiyalari — ishonchli natijalar",
        "subtitle": "UNG Burg‘ilash MCHJ — neft va gaz quduqlarini burg‘ilash, texnik xizmat ko‘rsatish va zamonaviy burg‘ilash texnologiyalarini joriy etish bo‘yicha professional kompaniya.",
        "about": "Kompaniya haqida",
        "contact": "Bog‘lanish"
      },
      "about": {
        "title": "Biz haqimizda",
        "items": [
          "Quduqlarni burg‘ilash va o'zlashtirish",
          "Burg‘ilash muhandisligi",
          "Texnik xizmat ko‘rsatish",
          "Sanoat xavfsizligi va raqamli monitoring"
        ],
        "more": "Batafsil ma’lumot"
      },
      "contact": {
        "title": "Bog‘lanish",
        "info": "Aloqa ma'lumotlari",
        "address": "Manzil",
        "address_val": "O'zbekiston Respublikasi, Toshkent shahri, Yunusobod tumani, 123-uy",
        "phone": "Telefonlar",
        "email": "Email",
        "hours": "Ish vaqti",
        "hours_val": "Dush - Juma: 09:00 - 18:00 | Shanba, Yakshanba: Dam olish kuni",
        "send": "Xabar yuborish",
        "name": "Ism", "subject": "Mavzu", "message": "Xabar"
      },
      "activities": {
        "title": "Faoliyat yo'nalishlari",
        "drilling": "Quduqlarni burg'ilash",
        "drilling_desc": "Neft va gaz qidiruv va ishlatish quduqlarini zamonaviy qurilmalar yordamida burg'ilash.",
        "engineering": "Muhandislik xizmatlari",
        "engineering_desc": "Loyihalash, monitoring va quduqlarni o'zlashtirish jarayonlarini muhandislik qo'llab-quvvatlash.",
        "maintenance": "Texnik xizmat",
        "maintenance_desc": "Burg'ilash uskunalari va maxsus texnikalarga muntazam va mukammal texnik xizmat ko'rsatish."
      },
      "equipment": {
        "title": "Texnika va uskunalar",
        "model": "Model:", "category": "Turkum:", "specs": "Texnik xususiyatlar:", "not_found": "Ma'lumot topilmadi."
      },
      "projects": {
        "title": "Loyihalar",
        "location": "Joylashuv:", "type": "Tur:", "status": "Holat:", "not_found": "Ma'lumot topilmadi."
      },
      "news": {
        "title": "Yangiliklar", "not_found": "Yangiliklar topilmadi."
      },
      "vacancies": {
        "title": "Vakansiyalar",
        "dept": "Bo'lim:", "type": "Ish turi:", "apply": "Ariza topshirish", "not_found": "Bo'sh ish o'rinlari hozircha yo'q.",
        "modal_title": "Vakansiyaga ariza topshirish",
        "modal_name": "F.I.Sh", "modal_phone": "Telefon raqam", "modal_email": "Email", "modal_cv": "Rezyume (CV) yuklash",
        "modal_submit": "Ariza yuborish", "modal_cancel": "Bekor qilish"
      },
      "footer": {
        "desc": "Neft va gaz sohasida zamonaviy burg'ilash xizmatlari va innovatsion yechimlar taqdim etuvchi ishonchli hamkor.",
        "links": "Tezkor havolalar",
        "rights": "Barcha huquqlar himoyalangan."
      }
    }
  },
  ru: {
    translation: {
      "nav": {
        "home": "Главная", "company": "Компания", "activities": "Направления",
        "equipment": "Оборудование", "projects": "Проекты", "news": "Новости",
        "vacancies": "Вакансии", "contact": "Контакты", "contact_us": "Связаться"
      },
      "hero": {
        "title": "Современные технологии бурения — надежные результаты",
        "subtitle": "ООО «UNG Burg'ilash» — профессиональная компания по бурению нефтегазовых скважин, техническому обслуживанию и внедрению современных технологий бурения.",
        "about": "О компании",
        "contact": "Связаться"
      },
      "about": {
        "title": "О нас",
        "items": [
          "Бурение и освоение скважин",
          "Инженерия бурения",
          "Техническое обслуживание",
          "Промышленная безопасность и цифровой мониторинг"
        ],
        "more": "Подробнее"
      },
      "contact": {
        "title": "Связаться",
        "info": "Контактная информация",
        "address": "Адрес",
        "address_val": "Республика Узбекистан, г. Ташкент, Юнусабадский район, д. 123",
        "phone": "Телефоны",
        "email": "Эл. почта",
        "hours": "Режим работы",
        "hours_val": "Пн - Пт: 09:00 - 18:00 | Сб, Вс: Выходной",
        "send": "Отправить сообщение",
        "name": "Имя", "subject": "Тема", "message": "Сообщение"
      },
      "activities": {
        "title": "Направления деятельности",
        "drilling": "Бурение скважин",
        "drilling_desc": "Бурение разведочных и эксплуатационных нефтегазовых скважин с использованием современных установок.",
        "engineering": "Инжиниринговые услуги",
        "engineering_desc": "Проектирование, мониторинг и инженерное сопровождение процессов освоения скважин.",
        "maintenance": "Техническое обслуживание",
        "maintenance_desc": "Регулярное и капитальное техническое обслуживание бурового оборудования и спецтехники."
      },
      "equipment": {
        "title": "Техника и оборудование",
        "model": "Модель:", "category": "Категория:", "specs": "Тех. характеристики:", "not_found": "Данные не найдены."
      },
      "projects": {
        "title": "Проекты",
        "location": "Локация:", "type": "Тип:", "status": "Статус:", "not_found": "Данные не найдены."
      },
      "news": {
        "title": "Новости", "not_found": "Новости не найдены."
      },
      "vacancies": {
        "title": "Вакансии",
        "dept": "Отдел:", "type": "Тип работы:", "apply": "Подать заявку", "not_found": "Открытых вакансий пока нет.",
        "modal_title": "Подать заявку на вакансию",
        "modal_name": "Ф.И.О", "modal_phone": "Номер телефона", "modal_email": "Эл. почта", "modal_cv": "Загрузить резюме (CV)",
        "modal_submit": "Отправить", "modal_cancel": "Отмена"
      },
      "footer": {
        "desc": "Надежный партнер, предоставляющий современные буровые услуги и инновационные решения в нефтегазовой сфере.",
        "links": "Быстрые ссылки",
        "rights": "Все права защищены."
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "home": "Home", "company": "Company", "activities": "Activities",
        "equipment": "Equipment", "projects": "Projects", "news": "News",
        "vacancies": "Vacancies", "contact": "Contact", "contact_us": "Contact Us"
      },
      "hero": {
        "title": "Modern drilling technologies — reliable results",
        "subtitle": "UNG Burg'ilash LLC is a professional company for oil and gas well drilling, maintenance, and the introduction of modern drilling technologies.",
        "about": "About Company",
        "contact": "Contact"
      },
      "about": {
        "title": "About Us",
        "items": [
          "Well drilling and completion",
          "Drilling engineering",
          "Maintenance",
          "Industrial safety and digital monitoring"
        ],
        "more": "Read more"
      },
      "contact": {
        "title": "Contact",
        "info": "Contact Information",
        "address": "Address",
        "address_val": "Republic of Uzbekistan, Tashkent, Yunusabad district, 123",
        "phone": "Phones",
        "email": "Email",
        "hours": "Working hours",
        "hours_val": "Mon - Fri: 09:00 - 18:00 | Sat, Sun: Closed",
        "send": "Send Message",
        "name": "Name", "subject": "Subject", "message": "Message"
      },
      "activities": {
        "title": "Activities",
        "drilling": "Well Drilling",
        "drilling_desc": "Drilling exploratory and production oil and gas wells using modern rigs.",
        "engineering": "Engineering Services",
        "engineering_desc": "Design, monitoring, and engineering support for well completion processes.",
        "maintenance": "Maintenance",
        "maintenance_desc": "Regular and major maintenance of drilling equipment and special machinery."
      },
      "equipment": {
        "title": "Equipment & Machinery",
        "model": "Model:", "category": "Category:", "specs": "Specs:", "not_found": "No data found."
      },
      "projects": {
        "title": "Projects",
        "location": "Location:", "type": "Type:", "status": "Status:", "not_found": "No data found."
      },
      "news": {
        "title": "News", "not_found": "No news found."
      },
      "vacancies": {
        "title": "Vacancies",
        "dept": "Department:", "type": "Job type:", "apply": "Apply", "not_found": "No open vacancies right now.",
        "modal_title": "Apply for vacancy",
        "modal_name": "Full Name", "modal_phone": "Phone Number", "modal_email": "Email", "modal_cv": "Upload CV",
        "modal_submit": "Submit", "modal_cancel": "Cancel"
      },
      "footer": {
        "desc": "A reliable partner providing modern drilling services and innovative solutions in the oil and gas sector.",
        "links": "Quick Links",
        "rights": "All rights reserved."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "uz",
    fallbackLng: "uz",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
