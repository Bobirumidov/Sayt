import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Grid } from 'lucide-react';
import SitemapOverlay from './SitemapOverlay';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [topBanner, setTopBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.top_banner_img) {
          setTopBanner(data.top_banner_img);
        }
      })
      .catch(() => {});
  }, []);

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
    { name: t('nav.home'), href: '/#home' },
    { name: t('nav.company'), href: '/#about' },
    { name: 'Rahbariyat', href: '/rahbariyat' },
    { name: t('nav.activities'), href: '/#activities' },
    { name: t('nav.equipment'), href: '/#equipment' },
    { name: t('nav.projects'), href: '/#projects' },
    { name: t('nav.news'), href: '/#news' },
    { name: t('nav.vacancies'), href: '/#vacancies' },
    { name: t('nav.contact'), href: '/#contact' },
    { name: 'Xodimlar portali', href: '/portal' },
  ];

  return (
    <>
      {/* Banner - relative so it pushes content down naturally */}
      {topBanner && (
        <div className={`w-full z-50 bg-white flex justify-center transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-16 md:h-24 lg:h-28 opacity-100'}`}>
          <img 
            src={topBanner} 
            alt="Yuqori banner" 
            className="w-full max-w-[1920px] object-cover h-16 md:h-24 lg:h-28" 
          />
        </div>
      )}

      <header 
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'top-0 bg-corporate-dark/85 backdrop-blur-md/95 backdrop-blur-sm py-4 shadow-lg' 
            : `${topBanner ? 'top-16 md:top-24 lg:top-28' : 'top-0'} bg-transparent py-6`
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="UNG Logo" className="h-10 md:h-14 w-auto drop-shadow-md" />
            <div className="text-white font-bold text-xl md:text-2xl tracking-tighter drop-shadow-md hidden sm:block">
              UNG <span className="text-corporate-accent">Burg'ilash</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-4 xl:space-x-5 drop-shadow-md">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-200 hover:text-corporate-accent transition-colors text-sm font-medium">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Language & CTA */}
          <div className="hidden xl:flex items-center space-x-4">
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
            <button onClick={() => setIsSitemapOpen(true)} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <Grid size={24} />
              <span className="text-sm font-medium">Sayt xaritasi</span>
            </button>
            <a href="/#contact" className="bg-corporate-accent hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
              {t('nav.contact_us')}
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="xl:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-corporate-dark/85 backdrop-blur-md shadow-xl border-t border-white/10 flex flex-col">
            <button 
              onClick={() => { setIsSitemapOpen(true); setIsMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-corporate-accent hover:bg-white/5 px-6 py-4 border-b border-white/5 transition-colors text-sm font-medium"
            >
              <Grid size={20} />
              <span>Sayt xaritasi</span>
            </button>
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
          </div>
        )}

        <SitemapOverlay isOpen={isSitemapOpen} onClose={() => setIsSitemapOpen(false)} />
      </header>
    </>
  );
};

export default Header;





