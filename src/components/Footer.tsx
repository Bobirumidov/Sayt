import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>({});
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedBefore');
    let url = '/api/visitor-count';
    if (!hasVisited) {
      url += '?increment=true';
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setVisitorCount(data.count);
        }
      })
      .catch(err => console.error("Visitor count fetch error:", err));
  }, []);

  return (
    <footer className="bg-corporate-dark/85 backdrop-blur-md text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="UNG Logo" className="h-12 w-auto drop-shadow-md" />
              <div className="font-bold text-2xl tracking-tighter">
                UNG <span className="text-corporate-accent">Burg'ilash</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings.footer_desc || t('footer.desc')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-corporate-accent transition-colors">{t('nav.home')}</a></li>
              <li><a href="#about" className="hover:text-corporate-accent transition-colors">{t('nav.company')}</a></li>
              <li><a href="#activities" className="hover:text-corporate-accent transition-colors">{t('nav.activities')}</a></li>
              <li><a href="#projects" className="hover:text-corporate-accent transition-colors">{t('nav.projects')}</a></li>
              <li><a href="#news" className="hover:text-corporate-accent transition-colors">{t('nav.news')}</a></li>
              <li><a href="#contact" className="hover:text-corporate-accent transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('activities.title')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t('activities.drilling')}</li>
              <li>{t('activities.engineering')}</li>
              <li>{t('activities.maintenance')}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('contact.title')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span className="whitespace-pre-wrap">{settings.address || t('contact.address_val')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span className="whitespace-pre-wrap">{settings.phone || '+998 71 123 45 67'}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✉️</span>
                <span className="whitespace-pre-wrap">{settings.email || 'info@ung-burgilash.uz'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {settings.company_name || 'UNG Burg‘ilash MCHJ'}. {t('footer.rights')}</p>
          
          {/* Visitor Counter */}
          {visitorCount !== null && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-gray-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>
                {i18n.language === 'ru' 
                  ? `Просмотры: ${visitorCount.toLocaleString()}` 
                  : i18n.language === 'en' 
                    ? `Visitors: ${visitorCount.toLocaleString()}` 
                    : `Tashriflar soni: ${visitorCount.toLocaleString()}`}
              </span>
            </div>
          )}

          <div className="flex space-x-4 mt-4 md:mt-0">
            {settings.social_tg && <a href={settings.social_tg} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Telegram</a>}
            {settings.social_fb && <a href={settings.social_fb} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>}
            {settings.social_in && <a href={settings.social_in} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>}
            {(!settings.social_tg && !settings.social_fb && !settings.social_in) && (
              <>
                <a href="#" className="hover:text-white transition-colors">Telegram</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



