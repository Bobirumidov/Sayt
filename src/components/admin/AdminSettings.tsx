import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    company_name: "UNG Burg'ilash MCHJ",
    email: "info@ung-burgilash.uz",
    phone: "+998 71 123 45 67",
    about_text: "UNG Burg‘ilash MCHJ neft va gaz quduqlarini burg‘ilash sektorida faoliyat yurituvchi, sohada yetakchi o'rinlarni egallagan zamonaviy muhandislik kompaniyasidir.",
    about_image: "",
    slider_img_1: "",
    slider_img_2: "",
    slider_img_3: ""
  });
  
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    about_image: null,
    slider_img_1: null,
    slider_img_2: null,
    slider_img_3: null
  });

  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    about_image: null,
    slider_img_1: null,
    slider_img_2: null,
    slider_img_3: null
  });

  const [isSaving, setIsSaving] = useState(false);

  const fileRefAbout = useRef<HTMLInputElement>(null);
  const fileRefSlider1 = useRef<HTMLInputElement>(null);
  const fileRefSlider2 = useRef<HTMLInputElement>(null);
  const fileRefSlider3 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }));
        setPreviews(prev => ({
          ...prev,
          about_image: data.about_image || null,
          slider_img_1: data.slider_img_1 || null,
          slider_img_2: data.slider_img_2 || null,
          slider_img_3: data.slider_img_3 || null
        }));
      });
  }, []);

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [key]: file }));
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('company_name', settings.company_name);
      formData.append('email', settings.email);
      formData.append('phone', settings.phone);
      formData.append('about_text', settings.about_text);
      
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
            setPreviews(p => ({...p, [fieldKey]: null})); 
            setFiles(p => ({...p, [fieldKey]: null}));
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aloqa telefoni</label>
              <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asosiy Email</label>
            <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-bold text-gray-800">Asosiy sahifa (Slayder Rasmlari)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploader label="Slayder Rasm 1" fieldKey="slider_img_1" inputRef={fileRefSlider1} />
            <ImageUploader label="Slayder Rasm 2" fieldKey="slider_img_2" inputRef={fileRefSlider2} />
            <ImageUploader label="Slayder Rasm 3" fieldKey="slider_img_3" inputRef={fileRefSlider3} />
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-bold text-gray-800">Biz haqimizda qismi</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matn</label>
            <textarea rows={4} value={settings.about_text} onChange={e => setSettings({...settings, about_text: e.target.value})} className="w-full px-4 py-2 border rounded-md"></textarea>
          </div>

          <ImageUploader label="Biz haqimizda Rasmi" fieldKey="about_image" inputRef={fileRefAbout} />

          <button onClick={handleSave} disabled={isSaving} className="w-full bg-corporate-accent text-white px-6 py-3 rounded-lg font-bold mt-4">
            {isSaving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
