import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AdminEquipment = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState("Burg'ilash");
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/equipment');
      setEquipmentList(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchEquipment(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Rostdan ham bu texnikani o'chirmoqchimisiz?")) {
      await fetch(`http://localhost:5000/api/equipment/${id}`, { method: 'DELETE' });
      fetchEquipment();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('model', model);
    formData.append('category', category);
    formData.append('specs', specs);
    if(image) formData.append('image', image);

    await fetch('http://localhost:5000/api/equipment', {
      method: 'POST',
      body: formData
    });
    
    setName(''); setModel(''); setSpecs(''); setImage(null);
    setIsModalOpen(false);
    fetchEquipment();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Texnikalar boshqaruvi</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-corporate-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center font-medium">
          <Plus size={20} className="mr-2" /> Yangi qo'shish
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4">Rasm</th>
              <th className="p-4 font-medium">Nomi / Modeli</th>
              <th className="p-4 font-medium">Kategoriya</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {equipmentList.map((eq) => (
              <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  {eq.img ? <img src={eq.img} alt={eq.name} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded"></div>}
                </td>
                <td className="p-4 font-medium text-gray-800">{eq.name} <br/><span className="text-xs text-gray-400">{eq.model}</span></td>
                <td className="p-4 text-gray-600">{eq.category}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleDelete(eq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Yangi texnika qo'shish</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Texnika nomi" className="w-full px-4 py-2 border rounded-md" required />
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modeli" className="w-full px-4 py-2 border rounded-md" />
              <input type="text" value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder="Qisqacha xarakteristikasi" className="w-full px-4 py-2 border rounded-md" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                <option>Burg'ilash</option>
                <option>Nasoslar</option>
                <option>Transport</option>
                <option>Raqamli</option>
              </select>
              <div>
                <label className="block text-sm mb-1 text-gray-600">Texnika rasmi</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="w-full border p-2 rounded-md" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-md">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 bg-corporate-accent text-white rounded-md">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminEquipment;
