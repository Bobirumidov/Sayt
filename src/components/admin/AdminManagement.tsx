import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminManagement = () => {
  const [management, setManagement] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Rahbariyat',
    rate: '1',
    phone: ''
  });

  const [image, setImage] = useState<File | null>(null);
  const [existingImg, setExistingImg] = useState('');

  const fetchManagement = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.management_data) {
        setManagement(JSON.parse(data.management_data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchManagement(); }, []);

  const openAddModal = () => {
    setEditIndex(null);
    setFormData({
      name: '',
      position: '',
      department: 'Rahbariyat',
      rate: '1',
      phone: ''
    });
    setImage(null);
    setExistingImg('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, index: number) => {
    setEditIndex(index);
    setFormData({
      name: item.name || '',
      position: item.position || '',
      department: item.department || '',
      rate: item.rate || '',
      phone: item.phone || ''
    });
    setImage(null);
    setExistingImg(item.img || '');
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImg = existingImg;

    if (image) {
      // Trick: Upload to news endpoint, get URL, delete the dummy news.
      const fd = new FormData();
      fd.append('image', image);
      fd.append('title', 'dummy_upload');
      
      const res = await fetch('/api/news', { method: 'POST', body: fd });
      const dummy = await res.json();
      finalImg = dummy.img;
      
      // Delete dummy immediately
      await fetch(`/api/news/${dummy.id}`, { method: 'DELETE' });
    }

    const newItem = {
      ...formData,
      img: finalImg
    };

    let updated = [...management];
    if (editIndex !== null) {
      updated[editIndex] = newItem;
    } else {
      updated.push(newItem);
    }

    // Save to settings
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ management_data: JSON.stringify(updated) })
    });

    setIsModalOpen(false);
    fetchManagement();
  };

  const handleDelete = async (index: number) => {
    if(window.confirm("Rostdan o'chirmoqchimisiz?")) {
      const updated = management.filter((_, i) => i !== index);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ management_data: JSON.stringify(updated) })
      });
      fetchManagement();
    }
  };

  const formatImg = (url: string) => {
    if (!url) return '';
    return url.replace('http://localhost:5000', '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Rahbariyat boshqaruvi</h2>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-corporate-accent text-white rounded-lg hover:bg-blue-600">
          <Plus size={18} className="mr-2" /> Qo'shish
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#009FE3] text-white">
              <th className="p-4 font-semibold">№</th>
              <th className="p-4 font-semibold">F.I.Sh</th>
              <th className="p-4 font-semibold">Lavozim</th>
              <th className="p-4 font-semibold">Bo'linma</th>
              <th className="p-4 font-semibold">Ichki tel</th>
              <th className="p-4 font-semibold text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {management.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors bg-[#2E2E2E] text-white">
                <td className="p-4 border-b border-gray-700">{index + 1}</td>
                <td className="p-4 border-b border-gray-700 flex items-center space-x-4">
                  {item.img && <img src={formatImg(item.img)} alt="avatar" className="w-12 h-16 object-cover rounded shadow-sm" />}
                  <span>{item.name}</span>
                </td>
                <td className="p-4 border-b border-gray-700 text-[#009FE3]">{item.position}</td>
                <td className="p-4 border-b border-gray-700">{item.department}</td>
                <td className="p-4 border-b border-gray-700">{item.phone}</td>
                <td className="p-4 border-b border-gray-700 text-right space-x-2">
                  <button onClick={() => openEditModal(item, index)} className="p-2 text-[#009FE3] hover:bg-white/10 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(index)} className="p-2 text-red-500 hover:bg-white/10 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editIndex !== null ? "Tahrirlash" : "Yangi qo'shish"}</h3>
            </div>
            
            <form onSubmit={handleSave} className="p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">F.I.Sh</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Lavozim</label>
                  <input required type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Bo'linma</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Ichki telefon</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                
                <div>
                  <label className="block text-sm mb-1 text-gray-600 font-medium">Rasm (Kichik rasm)</label>
                  <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full" accept="image/*" />
                  {existingImg && <p className="text-xs text-blue-500 mt-1">Eski rasm saqlangan. O'zgartirish uchun yangi yuklang.</p>}
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-3">
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

export default AdminManagement;
