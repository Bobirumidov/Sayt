import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AdminVacancies = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We send JSON for this one, since no image is required for vacancies
    await fetch('/api/vacancies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dept, type, desc })
    });
    
    setTitle(''); setDept(''); setDesc('');
    setIsModalOpen(false);
    fetchVacancies();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Rostdan o'chirmoqchimisiz?")) {
      await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
      fetchVacancies();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Vakansiyalar boshqaruvi</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium"><Plus size={20} className="mr-2" /> E'lon qo'shish</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Lavozim</th>
              <th className="p-4 font-medium">Bo'lim</th>
              <th className="p-4 font-medium">Ish turi</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vacancies.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{item.title}</td>
                <td className="p-4 text-gray-600">{item.dept}</td>
                <td className="p-4 text-gray-600">{item.type}</td>
                <td className="p-4 text-right space-x-2">
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
              <h3 className="font-bold">Yangi vakansiya</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Lavozim (masalan: Muhandis)" className="w-full px-4 py-2 border rounded-md" required />
              <input type="text" value={dept} onChange={e => setDept(e.target.value)} placeholder="Bo'lim (masalan: IT bo'limi)" className="w-full px-4 py-2 border rounded-md" required />
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                <option>To'liq stavka</option>
                <option>Yarim stavka</option>
                <option>Vaxta usuli</option>
              </select>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Talablar va vazifalar..." rows={4} className="w-full px-4 py-2 border rounded-md" required></textarea>
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
