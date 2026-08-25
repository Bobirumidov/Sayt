import { Users, Eye, Newspaper, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState({ news: 0, projects: 0, vacancies: 0, equipment: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [n, p, v, e] = await Promise.all([
          fetch('http://localhost:5000/api/news').then(r => r.json()),
          fetch('http://localhost:5000/api/projects').then(r => r.json()),
          fetch('http://localhost:5000/api/vacancies').then(r => r.json()),
          fetch('http://localhost:5000/api/equipment').then(r => r.json()),
        ]);
        setStatsData({ news: n.length, projects: p.length, vacancies: v.length, equipment: e.length });
      } catch (err) {
        console.error("Ma'lumot olishda xatolik:", err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Loyihalar", value: statsData.projects, icon: <Eye size={24} className="text-blue-500" />, change: "Faol" },
    { title: "Faol vakansiyalar", value: statsData.vacancies, icon: <Users size={24} className="text-green-500" />, change: "Mavjud" },
    { title: "Yangiliklar", value: statsData.news, icon: <Newspaper size={24} className="text-purple-500" />, change: "Nashr qilingan" },
    { title: "Texnikalar", value: statsData.equipment, icon: <MessageSquare size={24} className="text-yellow-500" />, change: "Bazada" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <span className="text-xs font-semibold text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">So'nggi qabul qilingan xabarlar (Namuna)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Ism</th>
                  <th className="pb-3 font-medium">Mavzu</th>
                  <th className="pb-3 font-medium">Vaqt</th>
                  <th className="pb-3 font-medium text-right">Harakat</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: "Sardor Aliyev", subj: "Hamkorlik masalasi", time: "10 daqiqa oldin" },
                  { name: "Malika Tohirova", subj: "Ishga kirish", time: "1 soat oldin" },
                  { name: "Javohir Rustamov", subj: "Texnika ijarasi", time: "Kecha" },
                ].map((msg, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">{msg.name}</td>
                    <td className="py-3 text-gray-600">{msg.subj}</td>
                    <td className="py-3 text-gray-500">{msg.time}</td>
                    <td className="py-3 text-right">
                      <button className="text-blue-600 hover:underline">O'qish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tezkor harakatlar</h3>
          <div className="space-y-3">
            <Link to="/admin/news" className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="font-medium text-sm">Yangi maqola qo'shish</span>
              <span className="text-xl">+</span>
            </Link>
            <Link to="/admin/projects" className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <span className="font-medium text-sm">Yangi loyiha qo'shish</span>
              <span className="text-xl">+</span>
            </Link>
            <Link to="/admin/vacancies" className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="font-medium text-sm">Vakansiya e'lon qilish</span>
              <span className="text-xl">+</span>
            </Link>
            <Link to="/admin/equipment" className="w-full flex items-center justify-between p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
              <span className="font-medium text-sm">Yangi texnika qo'shish</span>
              <span className="text-xl">+</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
