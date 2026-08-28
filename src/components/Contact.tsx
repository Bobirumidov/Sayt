import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-4">{t('contact.title')}</h2>
          <div className="w-20 h-1 bg-corporate-accent mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl font-bold text-corporate-dark mb-6">{t('contact.info')}</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-corporate-accent rounded-full flex items-center justify-center shrink-0 mr-4">📍</div>
                <div>
                  <h4 className="font-bold text-corporate-dark mb-1">{t('contact.address')}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{settings.address || t('contact.address_val')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-corporate-accent rounded-full flex items-center justify-center shrink-0 mr-4">📞</div>
                <div>
                  <h4 className="font-bold text-corporate-dark mb-1">{t('contact.phone')}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{settings.phone || '+998 71 123 45 67\n+998 90 987 65 43'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-corporate-accent rounded-full flex items-center justify-center shrink-0 mr-4">✉️</div>
                <div>
                  <h4 className="font-bold text-corporate-dark mb-1">{t('contact.email')}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{settings.email || 'info@ung-burgilash.uz\nhr@ung-burgilash.uz'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-corporate-accent rounded-full flex items-center justify-center shrink-0 mr-4">🕒</div>
                <div>
                  <h4 className="font-bold text-corporate-dark mb-1">{t('contact.hours')}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{settings.hours || t('contact.hours_val')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-corporate-dark/85 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">{t('contact.send')}</h3>
              
              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg">
                  Muvaffaqiyatli yuborildi!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.name')}</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:ring-corporate-accent focus:border-corporate-accent outline-none" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.phone')}</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:ring-corporate-accent focus:border-corporate-accent outline-none" placeholder="+998" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.email')}</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:ring-corporate-accent focus:border-corporate-accent outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.subject')}</label>
                  <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:ring-corporate-accent focus:border-corporate-accent outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.message')}</label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white focus:ring-corporate-accent focus:border-corporate-accent outline-none" required></textarea>
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full bg-corporate-accent hover:bg-blue-600 text-white py-4 rounded-md font-bold text-lg transition-colors mt-2 disabled:opacity-70">
                  {status === 'loading' ? '...' : t('contact.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;



