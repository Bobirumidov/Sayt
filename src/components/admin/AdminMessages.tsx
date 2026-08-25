import { useState, useEffect } from 'react';
import { Trash2, Download, MessageSquare, Briefcase } from 'lucide-react';

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'messages'>('applications');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      if (activeTab === 'applications') {
        const res = await fetch('/api/applications');
        setApplications(await res.json());
      } else {
        const res = await fetch('/api/messages');
        setMessages(await res.json());
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Rostdan o'chirmoqchimisiz?")) {
      await fetch(`/api/${activeTab}/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Xabarlar va Arizalar</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'applications' ? 'bg-corporate-accent text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Briefcase size={16} className="mr-2" /> Vakansiya arizalari (CV)
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'messages' ? 'bg-corporate-accent text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <MessageSquare size={16} className="mr-2" /> Umumiy xabarlar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'applications' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-medium">Ism (F.I.Sh)</th>
                <th className="p-4 font-medium">Aloqa (Tel / Email)</th>
                <th className="p-4 font-medium">Vakansiya</th>
                <th className="p-4 font-medium text-right">CV / Rezyume</th>
                <th className="p-4 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applications.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-600">
                    <div>{item.phone}</div>
                    <div className="text-xs text-blue-500">{item.email}</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{item.vacancy}</td>
                  <td className="p-4 text-right">
                    {item.img ? (
                      <a href={item.img} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-corporate-accent hover:underline bg-blue-50 px-3 py-1 rounded-full">
                        <Download size={14} /> <span>Yuklab olish</span>
                      </a>
                    ) : (
                      <span className="text-gray-400">Fayl yo'q</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Hozircha hech qanday ariza kelib tushmagan.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-medium">Ism</th>
                <th className="p-4 font-medium">Aloqa</th>
                <th className="p-4 font-medium">Mavzu</th>
                <th className="p-4 font-medium">Xabar matni</th>
                <th className="p-4 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {messages.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                  <td className="p-4 text-gray-800 font-medium whitespace-nowrap">{item.name}</td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    <div>{item.phone}</div>
                    <div className="text-xs text-blue-500">{item.email}</div>
                  </td>
                  <td className="p-4 text-gray-800 font-medium">{item.subject}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={item.message}>{item.message}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Hozircha hech qanday xabar yo'q.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
