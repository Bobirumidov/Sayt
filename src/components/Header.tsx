import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.company'), href: '#about' },
    { name: t('nav.activities'), href: '#activities' },
    { name: t('nav.equipment'), href: '#equipment' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.news'), href: '#news' },
    { name: t('nav.vacancies'), href: '#vacancies' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-corporate-dark/95 backdrop-blur-sm py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-2xl tracking-tighter">
          UNG <span className="text-corporate-accent">Burg'ilash</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-200 hover:text-corporate-accent transition-colors text-sm font-medium">
              {link.name}
            </a>
          ))}
        </nav>

        {/* Language & CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex space-x-2 text-white/80 text-sm font-semibold">
            {['uz', 'ru', 'en'].map((lang) => (
              <button 
                key={lang} 
                onClick={() => changeLanguage(lang)}
                className={`uppercase hover:text-white transition-colors ${i18n.language === lang ? 'text-corporate-accent' : ''}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <a href="#contact" className="bg-corporate-accent hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
            {t('nav.contact_us')}
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-corporate-dark shadow-xl border-t border-white/10 flex flex-col">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-gray-200 hover:text-corporate-accent hover:bg-white/5 px-6 py-4 border-b border-white/5 transition-colors text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="px-6 py-4 flex justify-between items-center bg-white/5">
             <div className="flex space-x-4 text-white/80 text-sm font-semibold">
                {['uz', 'ru', 'en'].map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => { changeLanguage(lang); setIsMobileMenuOpen(false); }}
                    className={`uppercase hover:text-white transition-colors ${i18n.language === lang ? 'text-corporate-accent' : ''}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
