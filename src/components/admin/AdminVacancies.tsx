import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const AdminVacancies = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [type, setType] = useState("To'liq stavka");
  const [desc, setDesc] = useState('');

  const fetchVacancies = async () => {
    try {
      const res = await fetch('/api/vacancies');
      setVacancies(await res.json());
    } catch (e) {}
  };

  useEffect(() => { fetchVacancies(); }, []);

  const openAddModal = () => {
    setEditId(null);
    setTitle(''); setDept(''); setType("To'liq stavka"); setDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setDept(item.department || item.dept || '');
    setType(item.type || "To'liq stavka");
    setDesc(item.desc || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      title,
      department: dept,
      type,
      desc
    };

    if (editId) {
      await fetch(`/api/vacancies/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    
    setIsModalOpen(false);
    fetchVacancies();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("O'chirishni xohlaysizmi?")) {
      await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
      fetchVacancies();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Vakansiyalar</h2>
        <button onClick={openAddModal} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium"><Plus size={20} className="mr-2" /> Yangi qo'shish</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Lavozim</th>
              <th className="p-4 font-medium">Bo'lim</th>
              <th className="p-4 font-medium">Turi</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vacancies.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{item.title}</td>
                <td className="p-4 text-gray-600">{item.department || item.dept}</td>
                <td className="p-4 text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.type}</span></td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {vacancies.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Hozircha bo'sh ish o'rinlari yo'q</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">{editId ? "Vakansiyani tahrirlash" : "Yangi vakansiya qo'shish"}</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lavozim nomi (Masalan: Burg'ilovchi muhandis)" className="w-full px-4 py-2 border rounded-md" required />
              <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Bo'lim (Masalan: Texnik bo'lim)" className="w-full px-4 py-2 border rounded-md" required />
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                <option>To'liq stavka</option>
                <option>Yarim stavka</option>
                <option>Smenali ish</option>
              </select>
              <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Vazifalar va talablar haqida..." className="w-full px-4 py-2 border rounded-md" required></textarea>
              
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
export default AdminVacancies;
