import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Droplet, HardHat, Wrench } from 'lucide-react';

const Activities = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Droplet size={40} />,
      title: t('activities.drilling'),
      description: t('activities.drilling_desc'),
      delay: 0.1
    },
    {
      icon: <HardHat size={40} />,
      title: t('activities.engineering'),
      description: t('activities.engineering_desc'),
      delay: 0.2
    },
    {
      icon: <Wrench size={40} />,
      title: t('activities.maintenance'),
      description: t('activities.maintenance_desc'),
      delay: 0.3
    }
  ];

  return (
    <section id="activities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-corporate-dark mb-4">{t('activities.title')}</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: service.delay, duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              <div className="w-20 h-20 bg-blue-50 text-corporate-accent rounded-full flex items-center justify-center mb-6 group-hover:bg-corporate-accent group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-corporate-dark mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
