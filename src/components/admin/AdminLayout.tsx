import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Briefcase, Wrench, Users, MessageSquare, LogOut, Settings, ScanFace, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const allMenuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, roles: ['superadmin', 'hr', 'editor'] },
    { name: 'Yangiliklar', path: '/admin/news', icon: <Newspaper size={20} />, roles: ['superadmin', 'editor'] },
    { name: 'Loyihalar', path: '/admin/projects', icon: <Briefcase size={20} />, roles: ['superadmin', 'editor'] },
    { name: 'Texnikalar', path: '/admin/equipment', icon: <Wrench size={20} />, roles: ['superadmin', 'editor'] },
    { name: 'Vakansiyalar', path: '/admin/vacancies', icon: <Users size={20} />, roles: ['superadmin', 'hr'] },
    { name: 'Xabarlar', path: '/admin/messages', icon: <MessageSquare size={20} />, roles: ['superadmin', 'hr'] },
    { name: 'Foydalanuvchilar', path: '/admin/users', icon: <UserCog size={20} />, roles: ['superadmin'] },
    { name: 'Face ID', path: '/admin/face-id', icon: <ScanFace size={20} />, roles: ['superadmin'] },
    { name: 'Sozlamalar', path: '/admin/settings', icon: <Settings size={20} />, roles: ['superadmin'] },
  ];

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-corporate-dark text-white flex flex-col h-full shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-tighter">UNG <span className="text-corporate-accent">Burg'ilash</span></h2>
          <p className="text-xs text-gray-400 mt-1">Boshqaruv paneli</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-corporate-accent text-white' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Tizimdan chiqish
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 h-16 flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {menuItems.find(m => m.path === location.pathname)?.name || 'Boshqaruv paneli'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 capitalize">{user.username} ({user.role})</span>
            <div className="w-8 h-8 bg-corporate-accent text-white rounded-full flex items-center justify-center font-bold uppercase">
              {user.username.charAt(0)}
            </div>
            <a href="/" target="_blank" className="text-sm text-blue-600 hover:underline ml-4 border-l pl-4 border-gray-200">
              Saytni ko'rish ↗
            </a>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
