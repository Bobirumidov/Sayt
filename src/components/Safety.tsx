import { motion } from 'framer-motion';

const Safety = () => {
  return (
    <section className="py-20 bg-white/75 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-4">Mehnat xavfsizligi — ustuvor vazifa</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-white/75 backdrop-blur-md flex items-center justify-center rounded-full mb-6 p-2">
              <img src="https://www.google.com/s2/favicons?domain=gov.uz&sz=128" alt="O'zbekiston Gerbi" className="w-full h-full object-contain" />
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
            <div className="w-16 h-16 bg-white/75 backdrop-blur-md flex items-center justify-center rounded-full mb-6 p-2">
              <img src="https://www.google.com/s2/favicons?domain=eco.gov.uz&sz=128" alt="Ekologiya vazirligi" className="w-full h-full object-contain" />
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
            <div className="w-16 h-16 bg-white/75 backdrop-blur-md flex items-center justify-center rounded-full mb-6 p-2">
              <img src="https://www.google.com/s2/favicons?domain=gov.uz&sz=128" alt="O'zbekiston Gerbi" className="w-full h-full object-contain" />
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



