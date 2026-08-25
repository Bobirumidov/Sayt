import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const defaultBackgrounds = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1542385151-efd9000785a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
];

const Hero = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgrounds, setBackgrounds] = useState(defaultBackgrounds);

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        const newBgs = [];
        if (data.slider_img_1) newBgs.push(data.slider_img_1);
        if (data.slider_img_2) newBgs.push(data.slider_img_2);
        if (data.slider_img_3) newBgs.push(data.slider_img_3);
        
        if (newBgs.length > 0) {
          setBackgrounds(newBgs);
        }
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (backgrounds.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [backgrounds]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider & Overlay */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${backgrounds[currentIndex]}")` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-corporate-dark/90 to-corporate-dark/60"></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#about" className="bg-corporate-accent hover:bg-blue-600 text-white text-center px-8 py-3 rounded-md font-medium text-lg transition-colors">
              {t('hero.about')}
            </a>
            <a href="#contact" className="bg-transparent border border-white hover:bg-white/10 text-white text-center px-8 py-3 rounded-md font-medium text-lg transition-colors">
              {t('hero.contact')}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Animated visual element */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
