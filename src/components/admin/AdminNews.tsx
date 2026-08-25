import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Tabs for languages
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('uz');

  // Multi-lang state
  const [formData, setFormData] = useState({
    title_uz: '', title_ru: '', title_en: '',
    category_uz: '', category_ru: '', category_en: '',
    desc_uz: '', desc_ru: '', desc_en: ''
  });

  const [image, setImage] = useState<File | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      setNews(await res.json());
    } catch (e) {}
  };

  useEffect(() => { fetchNews(); }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      title_uz: '', title_ru: '', title_en: '',
      category_uz: '', category_ru: '', category_en: '',
      desc_uz: '', desc_ru: '', desc_en: ''
    });
    setImage(null);
    setActiveTab('uz');
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setFormData({
      title_uz: item.title_uz || item.title || '', 
      title_ru: item.title_ru || '', 
      title_en: item.title_en || '',
      category_uz: item.category_uz || item.category || '', 
      category_ru: item.category_ru || '', 
      category_en: item.category_en || '',
      desc_uz: item.desc_uz || item.desc || '', 
      desc_ru: item.desc_ru || '', 
      desc_en: item.desc_en || ''
    });
    setImage(null);
    setActiveTab('uz');
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (!editId) data.append('date', new Date().toLocaleDateString('uz-UZ'));
    if (image) data.append('image', image);

    try {
      const url = editId ? `/api/news/${editId}` : '/api/news';
      const method = editId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method: method,
        body: data
      });
      
      setIsModalOpen(false);
      fetchNews();
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    if(window.confirm("Rostdan o'chirmoqchimisiz?")) {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      fetchNews();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Yangiliklar boshqaruvi</h2>
        <button onClick={openAddModal} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium"><Plus size={20} className="mr-2" /> Yangi qo'shish</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4">Rasm</th>
              <th className="p-4 font-medium">Sarlavha (UZ)</th>
              <th className="p-4 font-medium">Sana</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {news.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  {item.img ? <img src={item.img} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded"></div>}
                </td>
                <td className="p-4 font-medium text-gray-800">{item.title_uz || item.title}</td>
                <td className="p-4 text-gray-600">{item.date}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold">{editId ? "Yangilikni tahrirlash" : "Yangilik qo'shish"}</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            {/* Language Tabs */}
            <div className="flex border-b px-4 shrink-0 mt-2">
              <button onClick={() => setActiveTab('uz')} className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'uz' ? 'border-corporate-accent text-corporate-accent' : 'border-transparent text-gray-500'}`}>O'zbekcha (UZ)</button>
              <button onClick={() => setActiveTab('ru')} className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'ru' ? 'border-corporate-accent text-corporate-accent' : 'border-transparent text-gray-500'}`}>Русский (RU)</button>
              <button onClick={() => setActiveTab('en')} className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'en' ? 'border-corporate-accent text-corporate-accent' : 'border-transparent text-gray-500'}`}>English (EN)</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Dynamic Inputs based on activeTab */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Sarlavha ({activeTab.toUpperCase()})</label>
                  <input type="text" name={`title_${activeTab}`} value={(formData as any)[`title_${activeTab}`]} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Kategoriya ({activeTab.toUpperCase()})</label>
                  <input type="text" name={`category_${activeTab}`} value={(formData as any)[`category_${activeTab}`]} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Matn ({activeTab.toUpperCase()})</label>
                  <textarea rows={6} name={`desc_${activeTab}`} value={(formData as any)[`desc_${activeTab}`]} onChange={handleChange} className="w-full px-4 py-2 border rounded-md"></textarea>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />
              
              <div>
                <label className="block text-sm mb-1 text-gray-600 font-medium">Rasm yuklash (Barcha tillar uchun umumiy)</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} className="w-full border p-2 rounded-md" />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-md">Bekor</button>
                <button type="submit" className="px-4 py-2 bg-corporate-accent text-white rounded-md">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminNews;
