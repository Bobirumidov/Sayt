import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const projectTypes = ["Barchasi", "Burg'ilash", "Neft", "Gaz", "Texnik loyihalar"];

const Projects = () => {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState("Barchasi");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const filtered = activeType === "Barchasi" ? projects : projects.filter(p => p.type === activeType);

  return (
    <section id="projects" className="py-20 bg-gray-900/80 backdrop-blur-md text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t('projects.title')}</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto mb-8"></div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {projectTypes.map((type, idx) => (
              <button key={idx} onClick={() => setActiveType(type)} className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeType === type ? 'bg-corporate-accent text-white' : 'bg-white/10 text-gray-300'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? filtered.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group cursor-pointer">
              <div className="relative h-72 rounded-xl overflow-hidden mb-4 bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-corporate-accent text-white text-xs px-2 py-1 rounded mb-2 inline-block">{item.type}</span>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-300">{t('projects.location')} {item.location}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{t('projects.status')} <span className={item.status === 'Yakunlangan' ? 'text-green-400' : 'text-yellow-400'}>{item.status}</span></span>
                </div>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center text-gray-500">{t('projects.not_found')}</div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Projects;



