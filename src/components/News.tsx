import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const News = () => {
  const { t, i18n } = useTranslation();
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNewsItems(data))
      .catch(err => console.error(err));
  }, []);

  const getVal = (item: any, key: string) => {
    // Return localized value or fallback to default 'uz' or generic key
    return item[`${key}_${i18n.language}`] || item[`${key}_uz`] || item[key] || '';
  };

  const formatImg = (url: string) => {
    if (!url) return '';
    return url.replace('http://localhost:5000', '');
  };

  return (
    <section id="news" className="py-20 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-4">{t('news.title')}</h2>
            <div className="w-20 h-1 bg-corporate-accent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full"
            >
              <Link to={`/news/${item.id}`} className="h-48 overflow-hidden relative block">
                <img src={formatImg(item.img) || "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600"} alt={getVal(item, 'title')} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute top-4 left-4 bg-corporate-dark/85 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
                  {getVal(item, 'category')}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-400 mb-2">{item.date}</div>
                <Link to={`/news/${item.id}`}>
                  <h3 className="text-xl font-bold text-corporate-dark mb-3 hover:text-corporate-accent transition-colors cursor-pointer line-clamp-2">
                    {getVal(item, 'title')}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{getVal(item, 'desc')}</p>
                <Link to={`/news/${item.id}`} className="text-corporate-accent font-medium text-sm flex items-center hover:underline mt-auto">
                  Batafsil <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
          {newsItems.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-500">
              {t('news.not_found')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;



