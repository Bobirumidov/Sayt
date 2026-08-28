import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SitemapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultSitemapData = [
  {
    title: "Biz haqimizda",
    links: [
      "Aksiyadorlik jamiyati tarixi", "Faoliyat maqsadi va vazifalari", "Jamiyatning strategik rivojlanishi",
      "Tashkiliy tuzilma", "Kuzatuv kengashi", "Rahbariyat", "Boshqaruv raisi maslahatchilari",
      "Departament boshliqlari", "Tarkibiy bo'linmalar", "Faxriy xodimlar", "Ilmiy texnik kengash",
      "Sohaga oid me'yoriy hujjatlar", "Murojaatlar statistikasi", "Bo'sh ish o'rinlari", 
      "Umumiy ma'lumotlar", "Gender tengligi"
    ]
  },
  {
    title: "Investor va aksiyadorlar uchun",
    links: [
      "Biznes reja asosiy parametrlarining bajarilishi", "Aksiyadorlik kapitalining tarkibi",
      "Aksiyadorlarning umumiy yig'ilishi", "Oshkor qilingan ma'lumotlar", "Ustav va ichki nizomlar",
      "Korporativ boshqaruv kodeksi", "Hisobotlar", "Investitsion loyihalar", "Aksiyalarni sotib olish",
      "Davlat kafolati ostidagi xorijiy kreditlar...", "Dividendlar", "Aktivlarni sotish va ijaraga berish",
      "Investor va aksiyadorlarning savollari", "Risklarni boshqarish tizimi", "Yangiliklar"
    ]
  },
  {
    title: "Interaktiv xizmatlar",
    links: [
      "Fuqarolarning murojaatlari", "Import qilinadigan mahsulotni o'zlashtirish",
      "So'rovnomalar", "Neft va gaz atamalarining izohli lug'ati", "Qonunchilik yangiliklari",
      "Favqulodda vaziyatlarda harakat qilish", "Ochiq ma'lumotlar mobil ilovasi", "Ratsionalizatorlik takliflari"
    ]
  },
  {
    title: "Ochiq ma'lumotlar",
    links: [
      "Ochiq ma'lumotlar", "Ochiqlik indeksini hisoblash natijalari",
      "Ochiqlikni ta'minlash bo'yicha qonunchilik hujjatlari",
      "Ochiqlik sohasidagi shikoyatlarni ko'rib chiqish tartibi",
      "Ochiqlik bo'yicha takliflar", "Onlayn translatsiyalar"
    ]
  },
  {
    title: "ESG",
    links: [
      "Barqaror rivojlanish bo'yicha hisobot", "Xodimlarga g'amxo'rlik", "Sanoat xavfsizligi",
      "Mehnat muhofazasi masalalarini boshqarish", "Barqaror rivojlanish boshqaruv tizimi",
      "Ekologik javobgarlik", "Ijtimoiy rivojlanishga kompaniyaning qo'shgan hissasi",
      "Asosiy ESG ko'rsatkichlar", "Korporativ boshqaruv"
    ]
  },
  {
    title: "Aloqa",
    links: [
      "Bog'lanish uchun ma'lumotlar", "Murojaat yuborish shakli", "Ko'p beriladigan savollar",
      "Rasmiy veb-saytga ma'lumotlarni joylashtirish", "Anonim so'rovnoma", "Baholash"
    ]
  },
  {
    title: "Yoshlar siyosati",
    links: [
      "Yoshlar markazi yangiliklari", "AJning Yoshlar markazi tashkiliy tuzilmasi"
    ]
  },
  {
    title: "Korrupsiyaga qarshi",
    links: [
      "Boshqaruv raisi MUROJAATI", "Lokal me'yoriy hujjatlar", "Aloqa kanallari", "Ko'p beriladigan savollar"
    ]
  },
  {
    title: "Biznesga oid",
    links: [
      "Xaridlar", "Mahalliylashtirish", "Tijorat takliflari", "Sertifikatlar va litsenziyalar"
    ]
  }
];

const SitemapOverlay: React.FC<SitemapOverlayProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<any[]>(defaultSitemapData);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(settings => {
          if (settings.sitemap_data) {
            try {
              const parsed = JSON.parse(settings.sitemap_data);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setData(parsed);
              }
            } catch (e) {
              console.error("Failed to parse sitemap data", e);
            }
          }
        })
        .catch(err => console.error("Failed to fetch settings for sitemap", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-8">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={32} className="text-gray-800" />
          </button>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 pb-20">
          {data.map((section, idx) => (
            <div key={idx} className="break-inside-avoid shadow-sm bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-corporate-accent mb-4 border-b pb-2 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link: string, linkIdx: number) => {
                  const isRahbariyat = link.toLowerCase().includes('rahbariyat');
                  
                  return (
                    <li key={linkIdx}>
                      <a 
                        href={isRahbariyat ? "/rahbariyat" : "#"}
                        onClick={(e) => {
                          if (!isRahbariyat) {
                            e.preventDefault();
                          }
                          onClose();
                        }}
                        className="text-sm text-gray-700 hover:text-corporate-accent transition-colors block"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapOverlay;



