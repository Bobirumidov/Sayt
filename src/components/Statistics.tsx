import { motion } from 'framer-motion';

const stats = [
  { label: "Yillik tajriba", value: "20+" },
  { label: "Amalga oshirilgan loyihalar", value: "100+" },
  { label: "Mutaxassis", value: "500+" },
  { label: "Texnik xizmat", value: "24/7" },
  { label: "Xavfsizlikka e'tibor", value: "100%" }
];

const Statistics = () => {
  return (
    <section className="bg-corporate-blue py-16 text-white relative z-20">
      <div className="container mx-auto px-4">
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
              <div className="text-4xl md:text-5xl font-bold text-corporate-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-blue-100 uppercase tracking-wider">
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
