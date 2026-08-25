import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>({
    about_text: "UNG Burg‘ilash MCHJ neft va gaz quduqlarini burg‘ilash sektorida faoliyat yurituvchi, sohada yetakchi o'rinlarni egallagan zamonaviy muhandislik kompaniyasidir.",
    about_image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.about_text || data.about_image) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.log(err));
  }, []);

  const items = t('about.items', { returnObjects: true }) as string[];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-corporate-dark mb-6">
              {t('about.title')}
            </h2>
            <div className="w-20 h-1 bg-corporate-accent mb-8"></div>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              {settings.about_text}
            </p>
            <ul className="space-y-4 mb-8">
              {Array.isArray(items) && items.map((item, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="text-corporate-accent mr-3">✔</span> {item}
                </li>
              ))}
            </ul>
            <a href="#" className="inline-block bg-corporate-dark hover:bg-corporate-blue text-white px-8 py-3 rounded-md font-medium transition-colors">
              {t('about.more')}
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-corporate-accent/20 rounded-lg transform translate-x-4 translate-y-4"></div>
            <img 
              src={settings.about_image} 
              alt="Biz haqimizda" 
              className="relative z-10 w-full rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
