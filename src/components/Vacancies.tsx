import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Vacancies = () => {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', vacancy: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetch('/api/vacancies')
      .then(res => res.json())
      .then(data => setVacancies(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('vacancy', formData.vacancy);
    if (cvFile) data.append('image', cvFile);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', vacancy: '' });
        setCvFile(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <section id="vacancies" className="py-20 bg-white/75 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-4">{t('vacancies.title')}</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto mb-8"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Vacancies List */}
          <div className="lg:w-2/3 space-y-6">
            {vacancies.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-corporate-dark mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>{t('vacancies.dept')} {job.dept}</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>{t('vacancies.type')} {job.type}</span>
                    </div>
                  </div>
                  <button onClick={() => setFormData({...formData, vacancy: job.title})} className="px-6 py-2 border-2 border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                    {t('vacancies.apply')}
                  </button>
                </div>
                <p className="text-gray-600 text-sm">{job.desc}</p>
              </motion.div>
            ))}
            {vacancies.length === 0 && <p className="text-gray-500">{t('vacancies.not_found')}</p>}
          </div>

          {/* Application Form */}
          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 sticky top-24"
            >
              <h3 className="text-2xl font-bold text-corporate-dark mb-6">{t('vacancies.modal_title')}</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Arizangiz muvaffaqiyatli qabul qilindi!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('vacancies.modal_name')}</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('vacancies.modal_phone')}</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('vacancies.modal_email')}</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vakansiya</label>
                  <select value={formData.vacancy} onChange={e => setFormData({...formData, vacancy: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none bg-white/70 backdrop-blur-md" required>
                    <option value="" disabled>Vakansiyani tanlang</option>
                    {vacancies.map(v => <option key={v.id} value={v.title}>{v.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('vacancies.modal_cv')}</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files ? e.target.files[0] : null)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-corporate-accent hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mt-6 shadow-md shadow-blue-500/20 disabled:opacity-70">
                  {isSubmitting ? "..." : t('vacancies.modal_submit')}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vacancies;



