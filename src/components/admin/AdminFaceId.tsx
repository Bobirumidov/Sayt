import { useState, useEffect, useRef } from 'react';
import { UserCheck, Trash2, Settings, ShieldAlert, Plus, Upload } from 'lucide-react';

const AdminFaceId = () => {
  const [faces, setFaces] = useState<any[]>([]);
  const [settings, setSettings] = useState({ hikvision_ip: '', hikvision_user: '', hikvision_pass: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const resFaces = await fetch('http://localhost:5000/api/faceIds');
      setFaces(await resFaces.json());
      
      const resSettings = await fetch('http://localhost:5000/api/settings');
      const setts = await resSettings.json();
      setSettings({
        hikvision_ip: setts.hikvision_ip || '',
        hikvision_user: setts.hikvision_user || '',
        hikvision_pass: setts.hikvision_pass || ''
      });
    } catch (e) {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Rostdan o'chirmoqchimisiz? (Eslatma: Haqiqiy apparatdan ham o'chiriladi)")) {
      await fetch(`http://localhost:5000/api/faceIds/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const resSettings = await fetch('http://localhost:5000/api/settings');
      const currentSettings = await resSettings.json();
      
      await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentSettings, ...settings })
      });
      alert('Sozlamalar saqlandi!');
    } catch (e) {
      alert('Xatolik yuz berdi');
    }
    setIsSaving(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddFace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Rasm yuklang!");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('employeeId', employeeId);
    formData.append('image', image);

    try {
      await fetch('http://localhost:5000/api/faceIds', {
        method: 'POST',
        body: formData
      });
      setIsModalOpen(false);
      setName(''); setEmployeeId(''); setImage(null); setPreview(null);
      fetchData();
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><UserCheck className="text-blue-500" /> Face ID Boshqaruvi</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium">
          <Plus size={20} className="mr-2" /> Xodim qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Ro'yxatdan o'tgan xodimlar</h3>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{faces.length} kishi</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 bg-white">
                <th className="p-4 font-medium">Yuz (Rasm)</th>
                <th className="p-4 font-medium">Ism</th>
                <th className="p-4 font-medium">Tabel ID</th>
                <th className="p-4 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {faces.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block mt-3">{item.employeeId}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {faces.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Hech kim ro'yxatdan o'tmagan. <br/><a href="/face-registration" target="_blank" className="text-blue-500 hover:underline">/face-registration</a> sahifasiga kiring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Settings size={18} className="text-gray-600" />
            <h3 className="font-bold text-gray-700">Hikvision Apparat Sozlamalari</h3>
          </div>
          <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start gap-3 mb-6">
              <ShieldAlert className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-yellow-800">
                Ushbu ma'lumotlar saytni to'g'ridan-to'g'ri Hikvision tarmog'iga ulab, yuzlarni yuborishi uchun kerak (API ISAPI). Local IP yozing.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apparat IP manzili</label>
              <input type="text" value={settings.hikvision_ip} onChange={e => setSettings({...settings, hikvision_ip: e.target.value})} placeholder="Masalan: 192.168.1.64" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login (Foydalanuvchi nomi)</label>
              <input type="text" value={settings.hikvision_user} onChange={e => setSettings({...settings, hikvision_user: e.target.value})} placeholder="admin" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input type="password" value={settings.hikvision_pass} onChange={e => setSettings({...settings, hikvision_pass: e.target.value})} placeholder="••••••" className="w-full px-4 py-2 border rounded-md" />
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-corporate-dark hover:bg-gray-800 text-white font-medium py-2 rounded-md transition-colors mt-4">
              {isSaving ? 'Saqlanmoqda...' : 'Saqlash va Ulanish'}
            </button>
          </form>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-700 mb-2">Yoki iVMS-4200 orqali ulash</h4>
            <p className="text-sm text-gray-500 mb-4">
              Agar to'g'ridan-to'g'ri ulana olmasangiz, barcha yuzlarni ZIP arxiv qilib yuklab oling va iVMS-4200 dasturidan "Import" qiling.
            </p>
            <a href="http://localhost:5000/api/faceIds/export" download className="block w-full text-center bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-2 rounded-md transition-colors">
              ZIP qilib yuklab olish
            </a>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Yangi xodim qo'shish</h3>
              <button onClick={() => { setIsModalOpen(false); setPreview(null); setImage(null); }}>✕</button>
            </div>
            <form onSubmit={handleAddFace} className="p-6 space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="F.I.Sh (Ism Familiya)" className="w-full px-4 py-2 border rounded-md" required />
              <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="Tabel ID (Raqami)" className="w-full px-4 py-2 border rounded-md" required />
              
              <div className="pt-2">
                {preview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={() => { setPreview(null); setImage(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                    <Upload size={32} />
                    <span className="font-medium text-sm">Rasmni yuklash</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => { setIsModalOpen(false); setPreview(null); setImage(null); }} className="px-4 py-2 bg-gray-100 rounded-md">Bekor</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-corporate-accent text-white rounded-md">
                  {isSubmitting ? 'Saqlanmoqda...' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminFaceId;
