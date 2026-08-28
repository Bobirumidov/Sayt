import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Statistics = () => {
  const [stats, setStats] = useState([
    { label: "Yillik tajriba", value: "20+" },
    { label: "Amalga oshirilgan loyihalar", value: "100+" },
    { label: "Mutaxassis", value: "500+" },
    { label: "Texnik xizmat", value: "24/7" },
    { label: "Xavfsizlikka e'tibor", value: "100%" }
  ]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.stat_1_val) {
          setStats([
            { label: data.stat_1_lbl || "Yillik tajriba", value: data.stat_1_val },
            { label: data.stat_2_lbl || "Amalga oshirilgan loyihalar", value: data.stat_2_val || "100+" },
            { label: data.stat_3_lbl || "Mutaxassis", value: data.stat_3_val || "500+" },
            { label: data.stat_4_lbl || "Texnik xizmat", value: data.stat_4_val || "24/7" },
            { label: data.stat_5_lbl || "Xavfsizlikka e'tibor", value: data.stat_5_val || "100%" }
          ]);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <section 
      className="py-16 relative z-20 border-y border-gray-200"
      style={{ backgroundImage: 'url(/stats-bg.png)', backgroundRepeat: 'repeat', backgroundSize: 'auto' }}
    >
      <div className="absolute inset-0 bg-white/40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-corporate-blue mb-2 drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base break-words font-bold text-corporate-dark uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;




