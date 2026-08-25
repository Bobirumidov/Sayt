import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.message || "Login yoki parol noto'g'ri!");
      }
    } catch (err) {
      setError("Server bilan ulanishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-corporate-blue text-white rounded-full flex items-center justify-center">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-corporate-dark mb-8">Admin Panelga kirish</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Login</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-corporate-accent focus:border-corporate-accent" 
              placeholder="admin"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parol</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-corporate-accent focus:border-corporate-accent" 
              placeholder="admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-corporate-accent hover:bg-blue-600 text-white py-3 rounded-md font-bold transition-colors">
            Tizimga kirish
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Hozircha test uchun: Login: <b>admin</b> | Parol: <b>admin</b>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
