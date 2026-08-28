import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [agreementChecked, setAgreementChecked] = useState(false);

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
        setAgreementChecked(false);
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

              {settings.disableMessages === 'true' || settings.disableMessages === true ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-white/10 rounded-lg bg-white/5">
                  <div className="text-7xl font-bold text-gray-600 mb-3 tracking-widest">504</div>
                  <div className="text-lg font-semibold text-gray-400 mb-2">Gateway Timeout</div>
                  <p className="text-sm text-gray-500">
                    {i18n.language === 'ru' 
                      ? "Сервер не ответил вовремя. Пожалуйста, повторите попытку позже."
                      : i18n.language === 'en'
                        ? "The server didn't respond in time. Please try again later."
                        : "Server vaqtida javob bermadi. Iltimos, keyinroq qayta urinib ko'ring."}
                  </p>
                </div>
              ) : (
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
                {/* Agreement Checkbox */}
                <div className="flex items-start gap-2 text-xs text-gray-400 mt-4 select-none">
                  <input 
                    type="checkbox" 
                    id="agreement-contact" 
                    checked={agreementChecked} 
                    onChange={e => setAgreementChecked(e.target.checked)} 
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-corporate-accent focus:ring-corporate-accent cursor-pointer"
                  />
                  <label htmlFor="agreement-contact" className="cursor-pointer text-gray-300">
                    {i18n.language === 'ru' 
                      ? "Я даю согласие на обработку моих персональных данных."
                      : i18n.language === 'en'
                        ? "I consent to the processing of my personal data."
                        : "Shaxsiy ma'lumotlarimni qayta ishlashlariga rozilik beraman."}
                  </label>
                </div>

                <button type="submit" disabled={status === 'loading' || !agreementChecked} className="w-full bg-corporate-accent hover:bg-blue-600 text-white py-4 rounded-md font-bold text-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === 'loading' ? '...' : t('contact.send')}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;



