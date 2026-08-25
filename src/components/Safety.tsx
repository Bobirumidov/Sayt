import { motion } from 'framer-motion';

const Safety = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-corporate-dark mb-4">Mehnat xavfsizligi — ustuvor vazifa</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-corporate-dark">Sanoat xavfsizligi</h3>
            <p className="text-gray-600 text-sm">Xalqaro ISO 45001 standartlari asosida ishchi xodimlarning hayoti va sog'lig'ini muhofaza qilish tizimi.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-blue-50 text-corporate-accent flex items-center justify-center rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-corporate-dark">Atrof-muhit muhofazasi</h3>
            <p className="text-gray-600 text-sm">Ekologik standartlarga to'liq rioya qilish va tabiatga zararni minimallashtirish (ISO 14001).</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 flex items-center justify-center rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-corporate-dark">Favqulodda vaziyatlar</h3>
            <p className="text-gray-600 text-sm">Avariya holatlariga shaylik va muntazam ravishda xodimlarni o'qitish mashg'ulotlari.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Safety;
