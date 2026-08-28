import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState<any>({
    company_name: "UNG Burg'ilash MCHJ",
    email: "info@ung-burgilash.uz",
    phone: "+998 71 123 45 67",
    about_text: "UNG Burg‘ilash MCHJ neft va gaz quduqlarini burg‘ilash sektorida faoliyat yurituvchi, sohada yetakchi o'rinlarni egallagan zamonaviy muhandislik kompaniyasidir.",
    about_image: "",
    slider_img_1: "",
    slider_img_2: "",
    slider_img_3: "",
    slider_img_4: "",
    slider_img_5: ""
  });
  
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    about_image: null,
    slider_img_1: null,
    slider_img_2: null,
    slider_img_3: null,
    slider_img_4: null,
    slider_img_5: null
  });

  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    about_image: null,
    slider_img_1: null,
    slider_img_2: null,
    slider_img_3: null,
    slider_img_4: null,
    slider_img_5: null
  });

  const [isSaving, setIsSaving] = useState(false);

  const fileRefAbout = useRef<HTMLInputElement>(null);
  const fileRefSlider1 = useRef<HTMLInputElement>(null);
  const fileRefSlider2 = useRef<HTMLInputElement>(null);
  const fileRefSlider3 = useRef<HTMLInputElement>(null);
  const fileRefSlider4 = useRef<HTMLInputElement>(null);
  const fileRefSlider5 = useRef<HTMLInputElement>(null);
  const fileRefTopBanner = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings((prev: any) => ({ ...prev, ...data }));
        setPreviews((prev: any) => ({
          ...prev,
          about_image: data.about_image || null,
          slider_img_1: data.slider_img_1 || null,
          slider_img_2: data.slider_img_2 || null,
          slider_img_3: data.slider_img_3 || null,
          slider_img_4: data.slider_img_4 || null,
          slider_img_5: data.slider_img_5 || null,
          top_banner_img: data.top_banner_img || null
        }));
      });
  }, []);

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev: any) => ({ ...prev, [key]: file }));
      setPreviews((prev: any) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(settings).forEach(key => {
        formData.append(key, (settings as any)[key]);
      });
      
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key] as File);
        }
      });

      await fetch('/api/settings', {
        method: 'POST',
        body: formData
      });
      alert('Sozlamalar saqlandi!');
    } catch (e) {
      alert('Xatolik yuz berdi');
    }
    setIsSaving(false);
  };

  const ImageUploader = ({ label, fieldKey, inputRef }: { label: string, fieldKey: string, inputRef: any }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {previews[fieldKey] ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 mb-2 w-full h-48">
          <img src={previews[fieldKey]!} alt={label} className="w-full h-full object-cover" />
          <button onClick={() => { 
            setPreviews((p: any) => ({...p, [fieldKey]: null})); 
            setFiles((p: any) => ({...p, [fieldKey]: null}));
          }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md">✕</button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors mb-2">
          <Upload size={32} />
          <span className="font-medium text-sm">Rasmni yuklash</span>
        </button>
      )}
      <input type="file" ref={inputRef} onChange={(e) => handleFileChange(fieldKey, e)} accept="image/*" className="hidden" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tizim sozlamalari</h2>
        <div className="max-w-3xl space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kompaniya nomi</label>
              <input type="text" value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
            <h3 className="text-lg font-bold text-gray-800 border-t pt-6 mt-6">Aloqa ma'lumotlari</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manzil (Address)</label>
              <textarea rows={3} value={settings.address || ""} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefonlar (Har biri yangi qatorda)</label>
              <textarea rows={3} value={settings.phone || ""} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emaillar (Har biri yangi qatorda)</label>
              <textarea rows={3} value={settings.email || ""} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ish vaqti</label>
              <textarea rows={3} value={settings.hours || ""} onChange={e => setSettings({...settings, hours: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
            </div>
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-bold text-gray-800">Yuqori qismdagi banner (Masalan, 35 yillik)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ImageUploader label="Banner Rasmi (Bo'sh bo'lsa ko'rinmaydi)" fieldKey="top_banner_img" inputRef={fileRefTopBanner} />
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-bold text-gray-800">Asosiy sahifa (Slayder Rasmlari)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploader label="Slayder Rasm 1" fieldKey="slider_img_1" inputRef={fileRefSlider1} />
            <ImageUploader label="Slayder Rasm 2" fieldKey="slider_img_2" inputRef={fileRefSlider2} />
            <ImageUploader label="Slayder Rasm 3" fieldKey="slider_img_3" inputRef={fileRefSlider3} />
            <ImageUploader label="Slayder Rasm 4" fieldKey="slider_img_4" inputRef={fileRefSlider4} />
            <ImageUploader label="Slayder Rasm 5" fieldKey="slider_img_5" inputRef={fileRefSlider5} />
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-bold text-gray-800">Biz haqimizda qismi</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matn</label>
            <textarea rows={4} value={settings.about_text} onChange={e => setSettings({...settings, about_text: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
          </div>

          <ImageUploader label="Biz haqimizda Rasmi" fieldKey="about_image" inputRef={fileRefAbout} />
          
          <h3 className="text-lg font-bold text-gray-800 mt-6 border-t pt-6">Statistika (Raqamlar) qismi</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1-raqam (Matn)</label>
              <input type="text" value={(settings as any).stat_1_lbl || ""} onChange={e => setSettings({...settings, stat_1_lbl: e.target.value})} placeholder="Yillik tajriba" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1-raqam (Qiymat)</label>
              <input type="text" value={(settings as any).stat_1_val || ""} onChange={e => setSettings({...settings, stat_1_val: e.target.value})} placeholder="20+" className="w-full px-4 py-2 border rounded-md" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2-raqam (Matn)</label>
              <input type="text" value={(settings as any).stat_2_lbl || ""} onChange={e => setSettings({...settings, stat_2_lbl: e.target.value})} placeholder="Loyihalar" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2-raqam (Qiymat)</label>
              <input type="text" value={(settings as any).stat_2_val || ""} onChange={e => setSettings({...settings, stat_2_val: e.target.value})} placeholder="100+" className="w-full px-4 py-2 border rounded-md" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">3-raqam (Matn)</label>
              <input type="text" value={(settings as any).stat_3_lbl || ""} onChange={e => setSettings({...settings, stat_3_lbl: e.target.value})} placeholder="Mutaxassis" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">3-raqam (Qiymat)</label>
              <input type="text" value={(settings as any).stat_3_val || ""} onChange={e => setSettings({...settings, stat_3_val: e.target.value})} placeholder="500+" className="w-full px-4 py-2 border rounded-md" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">4-raqam (Matn)</label>
              <input type="text" value={(settings as any).stat_4_lbl || ""} onChange={e => setSettings({...settings, stat_4_lbl: e.target.value})} placeholder="Texnik xizmat" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">4-raqam (Qiymat)</label>
              <input type="text" value={(settings as any).stat_4_val || ""} onChange={e => setSettings({...settings, stat_4_val: e.target.value})} placeholder="24/7" className="w-full px-4 py-2 border rounded-md" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">5-raqam (Matn)</label>
              <input type="text" value={(settings as any).stat_5_lbl || ""} onChange={e => setSettings({...settings, stat_5_lbl: e.target.value})} placeholder="Xavfsizlik" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">5-raqam (Qiymat)</label>
              <input type="text" value={(settings as any).stat_5_val || ""} onChange={e => setSettings({...settings, stat_5_val: e.target.value})} placeholder="100%" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 border-t pt-6">Podval (Pastki qism) va Ijtimoiy tarmoqlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kompaniya haqida qisqacha (Podvaldagi matn)</label>
              <textarea rows={3} value={(settings as any).footer_desc || ""} onChange={e => setSettings({...settings, footer_desc: e.target.value})} className="w-full px-4 py-2 border rounded-md" placeholder="Kompaniyaning asosiy yo'nalishi va maqsadlari haqida qisqacha ma'lumot..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram havolasi (link)</label>
              <input type="text" value={(settings as any).social_tg || ""} onChange={e => setSettings({...settings, social_tg: e.target.value})} placeholder="https://t.me/username" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook havolasi (link)</label>
              <input type="text" value={(settings as any).social_fb || ""} onChange={e => setSettings({...settings, social_fb: e.target.value})} placeholder="https://facebook.com/..." className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn havolasi (link)</label>
              <input type="text" value={(settings as any).social_in || ""} onChange={e => setSettings({...settings, social_in: e.target.value})} placeholder="https://linkedin.com/..." className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="w-full bg-corporate-accent text-white px-6 py-3 rounded-lg font-bold mt-4">
            {isSaving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;

