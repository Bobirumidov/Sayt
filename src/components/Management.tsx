import { useState, useEffect } from 'react';

const Management = () => {
  const [management, setManagement] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.management_data) {
          setManagement(JSON.parse(data.management_data));
        }
      })
      .catch(e => console.error(e));
  }, []);

  const formatImg = (url: string) => {
    if (!url) return '';
    return url.replace('http://localhost:5000', '');
  };

  return (
    <div className="pt-32 pb-20 bg-[#1e1e1e] min-h-screen text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#009FE3]">Rahbariyat</h2>
        
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-700">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#009FE3] text-white">
                <th className="p-4 font-semibold w-16">№</th>
                <th className="p-4 font-semibold">F.I.Sh</th>
                <th className="p-4 font-semibold">Lavozim</th>
                <th className="p-4 font-semibold">Bo'linma</th>
                <th className="p-4 font-semibold text-center w-40">Ichki telefon raqami</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-[#2E2E2E]">
              {management.map((item, index) => (
                <tr key={index} className="hover:bg-[#383838] transition-colors">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 flex items-center space-x-4">
                    {item.img ? (
                      <img src={formatImg(item.img)} alt={item.name} className="w-14 h-16 object-cover rounded shadow-md" />
                    ) : (
                      <div className="w-14 h-16 bg-gray-600 rounded flex items-center justify-center shadow-md">
                        <span className="text-xs text-gray-400">Rasm yo'q</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-100">{item.name}</span>
                  </td>
                  <td className="p-4 text-[#009FE3] font-medium">{item.position}</td>
                  <td className="p-4 text-gray-300">{item.department}</td>
                  <td className="p-4 text-center text-gray-200">{item.phone}</td>
                </tr>
              ))}
              {management.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Management;



