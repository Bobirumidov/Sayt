import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Edit2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      setUsers(await res.json());
    } catch (e) {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAddModal = () => {
    setEditUserId(null);
    setUsername('');
    setPassword('');
    setRole('editor');
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditUserId(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await fetch(`/api/users/${editUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    if(window.confirm("Rostdan o'chirmoqchimisiz?")) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  const getRoleLabel = (r: string) => {
    if (r === 'superadmin') return 'Superadmin (Barcha huquqlar)';
    if (r === 'hr') return 'HR (Kadrlar bo\'limi)';
    if (r === 'editor') return 'Editor (Muharrir)';
    return r;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Shield className="mr-2 text-corporate-accent" />
            Foydalanuvchilar va Rollar
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tizimga kirish huquqlarini boshqarish</p>
        </div>
        <button onClick={openAddModal} className="bg-corporate-accent text-white px-4 py-2 rounded-lg flex items-center font-medium">
          <Plus size={20} className="mr-2" /> Yangi qo'shish
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Login</th>
              <th className="p-4 font-medium">Parol</th>
              <th className="p-4 font-medium">Roli</th>
              <th className="p-4 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{item.username}</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{item.password}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.role === 'superadmin' ? 'bg-red-100 text-red-700' : 
                    item.role === 'hr' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getRoleLabel(item.role)}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" disabled={item.username === 'admin'}>
                    <Trash2 size={18} />
                  </button>
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
              <h3 className="font-bold">{editUserId ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roli (Huquqi)</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border rounded-md" required disabled={username === 'admin'}>
                  <option value="editor">Editor (Muharrir: Yangilik, Loyiha, Texnika)</option>
                  <option value="hr">HR (Kadrlar: Vakansiyalar, CV xabarlar)</option>
                  <option value="superadmin">Superadmin (Barcha ruxsatlar)</option>
                </select>
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
export default AdminUsers;
