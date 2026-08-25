import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const categories = ["Barchasi", "Burg'ilash", "Nasoslar", "Transport", "Raqamli"];

const Equipment = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("Barchasi");
  const [equipments, setEquipments] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => setEquipments(data));
  }, []);

  const filtered = activeFilter === "Barchasi" 
    ? equipments 
    : equipments.filter(item => item.category === activeFilter);

  return (
    <section id="equipment" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-corporate-dark mb-4">{t('equipment.title')}</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto mb-8"></div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map((cat, idx) => (
              <button key={idx} onClick={() => setActiveFilter(cat)} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === cat ? 'bg-corporate-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.length > 0 ? filtered.map((item) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden relative bg-gray-100">
                  {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />}
                  <div className="absolute top-4 left-4 bg-corporate-blue text-white text-xs px-3 py-1 rounded-full font-medium">{item.category}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-corporate-dark mb-1">{item.name}</h3>
                  <div className="text-sm text-corporate-accent font-medium mb-3">{t('equipment.model')} {item.model}</div>
                  <p className="text-gray-600 text-sm mb-6"><span className="font-semibold">{t('equipment.specs')}</span> {item.specs}</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-gray-500">{t('equipment.not_found')}</div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
export default Equipment;
