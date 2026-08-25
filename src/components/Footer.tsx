import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-corporate-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-bold text-2xl tracking-tighter mb-4">
              UNG <span className="text-corporate-accent">Burg'ilash</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.desc')}
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
                {t('contact.address_val')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                +998 71 123 45 67
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                info@ung-burgilash.uz
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} UNG Burg‘ilash MCHJ. {t('footer.rights')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
