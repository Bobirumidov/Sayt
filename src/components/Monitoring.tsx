import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Wifi, Database } from 'lucide-react';

const Monitoring = () => {
  return (
    <section className="py-20 bg-corporate-dark/85 backdrop-blur-md text-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Burg‘ilash jarayonlarida raqamli monitoring</h2>
            <div className="w-20 h-1 bg-corporate-accent mb-8"></div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Biz eng so'nggi raqamli texnologiyalar orqali burg'ilash jarayonlarini 24/7 nazorat qilamiz. Bu orqali xavfsizlik va samaradorlikni eng yuqori darajaga olib chiqamiz.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Activity className="text-corporate-accent w-6 h-6" />, title: "Real vaqt monitoringi" },
                { icon: <ShieldCheck className="text-corporate-accent w-6 h-6" />, title: "Kiberxavfsizlik" },
                { icon: <Wifi className="text-corporate-accent w-6 h-6" />, title: "Tarmoq infratuzilmasi" },
                { icon: <Database className="text-corporate-accent w-6 h-6" />, title: "Ma'lumotlar tahlili" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  {item.icon}
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            {/* Futuristic Dashboard Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-corporate-dark/85 backdrop-blur-md/80 backdrop-blur-xl border border-corporate-accent/30 rounded-2xl p-6 shadow-2xl shadow-corporate-accent/20"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div className="text-lg font-bold text-white flex items-center"><Activity className="w-5 h-5 mr-2 text-green-400" /> Tizim holati: Faol</div>
                <div className="text-xs bg-corporate-accent/20 text-corporate-accent px-2 py-1 rounded">Live Data</div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Burg'ilash tezligi</span>
                    <span className="text-blue-400">45 m/s</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div className="bg-blue-500 h-2 rounded-full" initial={{ width: "0%" }} whileInView={{ width: "75%" }} transition={{ duration: 1.5 }}></motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Nasos bosimi</span>
                    <span className="text-yellow-400">120 bar</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div className="bg-yellow-500 h-2 rounded-full" initial={{ width: "0%" }} whileInView={{ width: "60%" }} transition={{ duration: 1.5, delay: 0.2 }}></motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Aylanma moment</span>
                    <span className="text-purple-400">22 kN·m</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div className="bg-purple-500 h-2 rounded-full" initial={{ width: "0%" }} whileInView={{ width: "40%" }} transition={{ duration: 1.5, delay: 0.4 }}></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Monitoring;



