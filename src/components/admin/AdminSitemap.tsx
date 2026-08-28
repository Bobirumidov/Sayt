import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

const AdminSitemap = () => {
  const [data, setData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        if (settings.sitemap_data) {
          try {
            setData(JSON.parse(settings.sitemap_data));
          } catch(e) {
            console.error(e);
          }
        } else {
          // default initial structure
          setData([
            { title: "Biz haqimizda", links: ["Aksiyadorlik jamiyati tarixi"] }
          ]);
        }
      });
  }, []);

  const addCategory = () => {
    setData([...data, { title: "Yangi bo'lim", links: [] }]);
  };

  const removeCategory = (idx: number) => {
    if(window.confirm("Rostdan ham bu bo'limni o'chirmoqchimisiz?")) {
      const newData = [...data];
      newData.splice(idx, 1);
      setData(newData);
    }
  };

  const updateTitle = (idx: number, value: string) => {
    const newData = [...data];
    newData[idx].title = value;
    setData(newData);
  };

  const updateLinks = (idx: number, text: string) => {
    const newData = [...data];
    // Split text by newlines and remove empty lines
    newData[idx].links = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    setData(newData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('sitemap_data', JSON.stringify(data));
      
      const res = await fetch('/api/settings', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Saqlashda xatolik");
      alert("Muvaffaqiyatli saqlandi!");
    } catch (err: any) {
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Sayt xaritasi (Mega menyu) boshqaruvi</h2>
        <div className="space-x-3 flex">
          <button onClick={addCategory} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center font-medium">
            <Plus size={20} className="mr-2" /> Yangi bo'lim
          </button>
          <button onClick={handleSave} disabled={isSaving} className="bg-corporate-accent hover:bg-blue-600 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center font-medium">
            <Save size={20} className="mr-2" /> {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
            <button 
              onClick={() => removeCategory(idx)} 
              className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <div className="space-y-4 pr-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bo'lim nomi</label>
                <input 
                  type="text" 
                  value={category.title}
                  onChange={(e) => updateTitle(idx, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Havolalar ro'yxati (har bir qator bitta havola)
                </label>
                <textarea 
                  rows={8}
                  value={category.links.join('\n')}
                  onChange={(e) => updateLinks(idx, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm whitespace-pre-wrap"
                  placeholder="Aksiyadorlik jamiyati tarixi&#10;Faoliyat maqsadi va vazifalari..."
                />
                <p className="text-xs text-gray-500 mt-1">Siz bu yerda havolalarning matnini har bir qatorga yozishingiz mumkin.</p>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed text-gray-500">
            Hozircha hech qanday bo'lim yo'q. "Yangi bo'lim" tugmasini bosing.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSitemap;
