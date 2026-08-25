import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState("Burg'ilash");
  const [status, setStatus] = useState("Jarayonda");
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const fetchProjects = async () => {
    const res = await fetch('http://localhost:5000/api/projects');
    setProjects(await res.json());
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('type', type);
    formData.append('status', status);
    formData.append('desc', desc);
    if(image) formData.append('image', image);

    await fetch('http://localhost:5000/api/projects', { method: 'POST', body: formData });
    setName(''); setLocation(''); setDesc(''); setImage(null);
    setIsModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("O'chirishni xohlaysizmi?")) {
      await fetch(`http://localhost:5000/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Loyihalar boshqaruvi</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium"><Plus size={20} className="mr-2" /> Yangi qo'shish</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4">Rasm</th>
              <th className="p-4 font-medium">Loyiha nomi</th>
              <th className="p-4 font-medium">Manzil</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {projects.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  {item.img ? <img src={item.img} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded"></div>}
                </td>
                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                <td className="p-4 text-gray-600">{item.location}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
              <h3 className="font-bold">Yangi loyiha qo'shish</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Loyiha nomi" className="w-full px-4 py-2 border rounded-md" required />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Manzil (hudud)" className="w-full px-4 py-2 border rounded-md" required />
              <div className="flex gap-4">
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                  <option>Burg'ilash</option>
                  <option>Neft</option>
                  <option>Gaz</option>
                  <option>Texnik loyihalar</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                  <option>Jarayonda</option>
                  <option>Yakunlangan</option>
                </select>
              </div>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Qisqacha ma'lumot" className="w-full px-4 py-2 border rounded-md"></textarea>
              <div>
                <label className="block text-sm mb-1 text-gray-600">Loyiha rasmi</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="w-full border p-2 rounded-md" />
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
export default AdminProjects;
