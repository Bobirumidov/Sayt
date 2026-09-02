import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, FileText, X, ShieldAlert, CheckCircle, UserPlus, LogIn, User, Trash2, MessageSquare, Send, ChevronDown, Check, Key, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const Portal = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [files, setFiles] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [targetUsername, setTargetUsername] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [activeTab, setActiveTab] = useState('files'); // files, users, chat

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]); // empty = group, array = private to these users
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [selectedFileRecipients, setSelectedFileRecipients] = useState<string[]>([]);
  const [showFileRecipientDropdown, setShowFileRecipientDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const lastMsgIdRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatIntervalRef = useRef<any>(null);

  // Password change states
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdTargetUser, setPwdTargetUser] = useState<any>(null); // null = self, {id, name, username} = admin resetting employee
  const [newPwdText, setNewPwdText] = useState('');
  const [confirmPwdText, setConfirmPwdText] = useState('');

  // Admin Add User states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState('employee');



  useEffect(() => {
    const savedUser = localStorage.getItem('portalUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchFiles();
      if (currentUser.role === 'admin') {
        fetchUsers();
      } else {
        // Just fetch users so they can send files to them
        fetchUsers();
      }
    }
  }, [currentUser]);

  const fetchFiles = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/portal/files?username=' + currentUser.username + '&role=' + currentUser.role);
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/portal/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
        if (data.length > 0 && !targetUsername) {
          const others = data.filter((u: any) => u.username !== currentUser.username);
          if (others.length > 0) setTargetUsername(others[0].username);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('portalUser', JSON.stringify(data.user));
        setPassword('');
      } else {
        setError(data.message || "Login yoki parol noto'g'ri");
      }
    } catch (err) {
      setError('Tarmoq xatosi.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('portalUser');
    setFiles([]);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Rostdan ham bu xodimni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch('/api/portal/users/' + id, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Xodim ochirildi');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (selectedFileRecipients.length === 0) {
      setError('Iltimos, kamida bitta qabul qiluvchini tanlang!');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('uploadedBy', currentUser.name);
    formData.append('targetUsernames', selectedFileRecipients.join(','));

    try {
      const res = await fetch('/api/portal/files', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setSuccess('Fayl muvaffaqiyatli yuborildi!');
        setSelectedFileRecipients([]); // Reset selection
        fetchFiles();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Fayl yuklashda xatolik yuz berdi.');
      }
    } catch (err) {
      setError('Tarmoq xatosi.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = (id: number) => {
    window.location.href = '/api/portal/files/' + id + '/download';
    setTimeout(() => {
      setFiles(files.filter(f => f.id !== id));
      setSuccess('Fayl yuklab olindi va serverdan ochirildi!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const fetchChat = async (since = 0) => {
    if (!currentUser) return;
    try {
      const params = `since=${since}&username=${currentUser.username}&role=${currentUser.role}`;
      const res = await fetch('/api/portal/chat?' + params);
      if (res.ok) {
        const msgs = await res.json();
        if (msgs.length > 0) {
          setChatMessages(prev => since ? [...prev, ...msgs] : msgs);
          lastMsgIdRef.current = msgs[msgs.length - 1].id;
        }
      }
    } catch (e) {}
  };

  const doSendChat = async () => {
    if (!chatText.trim() || chatSending || !currentUser) return;
    setChatSending(true);
    const trimmed = chatText.trim();
    setChatText('');
    
    // Find recipient names
    const recipientNames = selectedRecipients.map(username => {
      const u = allUsers.find((user: any) => user.username === username);
      return u ? u.name : username;
    });

    try {
      const res = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          name: currentUser.name,
          text: trimmed,
          toUsernames: selectedRecipients.length > 0 ? selectedRecipients : null,
          toNames: recipientNames.length > 0 ? recipientNames : null
        })
      });
      if (res.ok) {
        const msg = await res.json();
        setChatMessages(prev => [...prev, msg]);
        lastMsgIdRef.current = msg.id;
      } else {
        setChatText(trimmed); // restore text if failed
        const err = await res.json().catch(() => ({}));
        console.error('Chat send error:', err);
      }
    } catch (e) {
      setChatText(trimmed); // restore text if failed
      console.error('Chat send network error:', e);
    }
    setChatSending(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPwdText.trim()) {
      setError("Yangi parol bo'sh bo'lishi mumkin emas!");
      return;
    }
    if (newPwdText !== confirmPwdText) {
      setError("Parollar bir-biriga mos kelmadi!");
      return;
    }

    const isSelf = !pwdTargetUser;
    const endpoint = isSelf ? '/api/portal/change-password' : '/api/portal/admin-reset-password';
    const payload = isSelf 
      ? { username: currentUser.username, newPassword: newPwdText }
      : { adminUsername: currentUser.username, targetUserId: pwdTargetUser.id, newPassword: newPwdText };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(isSelf ? "Parolingiz muvaffaqiyatli o'zgartirildi!" : `${pwdTargetUser.name} paroli muvaffaqiyatli yangilandi!`);
        setShowPwdModal(false);
        setNewPwdText('');
        setConfirmPwdText('');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Tarmoq ulanishida xatolik.");
    }
  };

  const handleDeleteChatMessage = async (id: number) => {
    if (!window.confirm("Ushbu xabarni o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/portal/chat/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChatMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Barcha chat xabarlarini butunlay o'chirib tashlashni xohlaysizmi?")) return;
    try {
      const res = await fetch('/api/portal/chat', { method: 'DELETE' });
      if (res.ok) {
        setChatMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!addName.trim() || !addUsername.trim() || !addPassword.trim()) {
      setError("Barcha maydonlarni to'ldiring!");
      return;
    }

    try {
      const res = await fetch('/api/portal/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addName.trim(),
          username: addUsername.trim().toLowerCase(),
          password: addPassword.trim(),
          role: addRole
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Yangi xodim ${addName} muvaffaqiyatli qo'shildi!`);
        setShowAddUserModal(false);
        setAddName('');
        setAddUsername('');
        setAddPassword('');
        setAddRole('employee');
        fetchUsers();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || "Xodim qo'shishda xatolik.");
      }
    } catch (err) {
      setError("Tarmoq ulanishida xatolik.");
    }
  };

  const handleRoleChange = async (targetUserId: number, newRole: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/portal/admin-change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: currentUser.username,
          targetUserId,
          newRole
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Xodim roli muvaffaqiyatli yangilandi!");
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || "Rol o'zgartirishda xatolik.");
      }
    } catch (err) {
      setError("Tarmoq ulanishida xatolik.");
    }
  };

  // Start/stop chat polling
  useEffect(() => {
    if (!currentUser) return;
    fetchChat(0);
    chatIntervalRef.current = setInterval(() => {
      fetchChat(lastMsgIdRef.current);
    }, 3000);
    return () => clearInterval(chatIntervalRef.current);
  }, [currentUser]);


  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const exportUsersToCSV = () => {
    const csvContent = [
      ['F.I.SH', 'Login', 'Parol', 'Rol'].join(','),
      ...allUsers.map(u => [
        `"${u.name || ''}"`,
        `"${u.username || ''}"`,
        `"${u.password || ''}"`,
        `"${u.role || 'employee'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xodimlar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-corporate-accent/10 p-4 rounded-full text-corporate-accent">
              <ShieldAlert size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-corporate-dark mb-2">Xodimlar Portali</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Davom etish uchun tizimga kiring.
          </p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent"
                placeholder="Login"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent"
                placeholder="Parol"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-corporate-accent text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex justify-center items-center gap-2"
            >
              <LogIn size={18} /> <span>Tizimga kirish</span>
            </button>
          </form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <a href="/" className="text-gray-500 hover:text-corporate-accent text-sm font-semibold inline-flex items-center gap-1 transition-colors">
              <span>← Asosiy sahifaga qaytish</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <a href="/" className="text-sm font-semibold text-corporate-accent hover:text-blue-600 transition-colors inline-flex items-center gap-1">
            <span>← Asosiy sahifaga o'tish</span>
          </a>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-corporate-dark mb-2">Maxfiy Fayl Almashish</h1>
            <p className="text-gray-600">Fayllar faqat belgilanuvchiga korinadi va yuklangach ochib ketadi.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <button 
                  onClick={() => setActiveTab('files')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'files' ? 'bg-corporate-accent text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Fayllar
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'chat' ? 'bg-corporate-accent text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <MessageSquare size={14} />
                  Chat
                </button>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'users' ? 'bg-corporate-accent text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Xodimlar
                  </button>
                )}
              </div>

            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-corporate-dark">
                <div className="bg-blue-100 p-1.5 rounded-full text-corporate-accent"><User size={16} /></div>
                <div>
                  <span className="font-semibold block leading-none">{currentUser.name}</span>
                  {currentUser.role === 'admin' && <span className="text-[10px] uppercase text-corporate-accent font-bold">Admin</span>}
                </div>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <button 
                onClick={() => {
                  setPwdTargetUser(null); // self
                  setNewPwdText('');
                  setConfirmPwdText('');
                  setError('');
                  setShowPwdModal(true);
                }}
                className="text-gray-500 hover:text-corporate-accent transition-colors text-sm font-medium flex items-center gap-1"
                title="Parolni o'zgartirish"
              >
                <Key size={14} />
                <span className="hidden sm:inline">Parol</span>
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={20} /></button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6 flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {activeTab === 'files' && (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex-1 min-w-[250px]">
                  <h2 className="text-lg font-bold text-corporate-dark mb-2">Kimgadir fayl yuborish</h2>
                  <div className="flex flex-col sm:flex-row gap-4 items-center relative w-full">
                    {/* Multi select dropdown for files */}
                    <div className="flex-1 w-full relative">
                      <button
                        type="button"
                        onClick={() => setShowFileRecipientDropdown(!showFileRecipientDropdown)}
                        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold transition-all shadow-sm"
                      >
                        <span>
                          {selectedFileRecipients.length === 0 
                            ? 'Qabul qiluvchilarni tanlang...' 
                            : `Tanlanganlar (${selectedFileRecipients.length} ta)`}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </button>

                      {showFileRecipientDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowFileRecipientDropdown(false)} />
                          <div className="absolute top-[100%] left-0 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[220px] overflow-y-auto w-full p-2 z-20 mt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 tracking-wider border-b border-gray-50 mb-1">
                              Xodimlar ro'yxati
                            </div>
                            {allUsers.filter((u: any) => u.username !== currentUser.username).map((u: any) => {
                              const isSelected = selectedFileRecipients.includes(u.username);
                              return (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedFileRecipients(prev => prev.filter(un => un !== u.username));
                                    } else {
                                      setSelectedFileRecipients(prev => [...prev, u.username]);
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                  <span className="flex items-center gap-1.5">👤 {u.name}</span>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}>
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    <label className={`cursor-pointer ${uploading || selectedFileRecipients.length === 0 ? 'bg-gray-400' : 'bg-corporate-dark hover:bg-gray-800'} text-white px-6 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 whitespace-nowrap h-10 w-full sm:w-auto`}>
                      <Upload size={20} />
                      <span>{uploading ? 'Yuborilmoqda...' : 'Fayl tanlash va Yuborish'}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading || selectedFileRecipients.length === 0} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-gray-700">
                  {currentUser.role === 'admin' ? 'Barcha fayllar' : 'Sizga kelgan fayllar'} ({files.length})
                </h2>
                <button onClick={fetchFiles} className="text-sm text-corporate-accent hover:underline">Yangilash</button>
              </div>
              
              {files.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Hozircha hech qanday fayl yoq</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {files.map(file => (
                    <li key={file.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-corporate-accent">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{file.originalName}</h3>
                          <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>Yubordi: <strong className="text-gray-700">{file.uploadedBy}</strong></span>
                            {currentUser.role === 'admin' && <span>Kimga: <strong className="text-corporate-accent">{file.targetUsername}</strong></span>}
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                            <span>{new Date(file.uploadedAt).toLocaleString('uz-UZ')}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownload(file.id)}
                        className="flex items-center space-x-2 text-corporate-accent bg-blue-50 px-4 py-2 rounded-md hover:bg-corporate-accent hover:text-white transition-colors whitespace-nowrap"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">Olib qolish</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-bold text-gray-700">Xodimlar royxati ({allUsers.length})</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setAddName('');
                    setAddUsername('');
                    setAddPassword('');
                    setAddRole('employee');
                    setError('');
                    setShowAddUserModal(true);
                  }} 
                  className="text-xs bg-corporate-accent hover:bg-blue-600 text-white px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 shadow-sm"
                >
                  ➕ Yangi xodim qo'shish
                </button>
                <button 
                  onClick={exportUsersToCSV}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  title="Xodimlar ro'yxatini parollari bilan Excel (CSV) formatida yuklab olish"
                >
                  <Download size={14} /> Excelga yuklash
                </button>
                <button onClick={fetchUsers} className="text-sm text-corporate-accent hover:underline">Yangilash</button>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-100">
              {allUsers.map(user => (
                <li key={user.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role === 'admin' ? <ShieldAlert size={20} /> : <User size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {user.name}
                        {user.username === currentUser.username && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Siz</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">@{user.username}</span>
                        <span className="text-gray-300">•</span>
                        {user.username === currentUser.username ? (
                          <span className="text-xs font-semibold text-corporate-accent uppercase">{user.role || 'employee'}</span>
                        ) : (
                          <select
                            value={user.role || 'employee'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-[11px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-corporate-accent font-medium text-gray-700"
                          >
                            <option value="employee">Xodim</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => {
                          setPwdTargetUser({ id: user.id, name: user.name, username: user.username });
                          setNewPwdText('');
                          setConfirmPwdText('');
                          setError('');
                          setShowPwdModal(true);
                        }}
                        className="text-gray-400 hover:text-corporate-accent p-2"
                        title="Parolni yangilash"
                      >
                        <Key size={18} />
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                        title="Xodimni ochirish"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col" style={{ height: '600px' }}>
            {/* Chat header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-corporate-accent" />
                <h2 className="font-bold text-gray-700">Xodimlar Chat</h2>
              </div>
              <div className="flex items-center gap-4">
                {currentUser.role === 'admin' && chatMessages.length > 0 && (
                  <button 
                    onClick={handleClearChat}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                    Chatni tozalash
                  </button>
                )}
                <span className="text-xs text-gray-400">Har 3 soniyada yangilanadi</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageSquare size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">Hozircha hech qanday xabar yo'q</p>
                  <p className="text-xs mt-1">Birinchi bo'lib salom bering!</p>
                </div>
              ) : (
                chatMessages.map((msg: any) => {
                  const isMe = msg.username === currentUser.username;
                  
                  // Support both old database schema and new array schema
                  const recipients = msg.toUsernames || (msg.toUsername ? [msg.toUsername] : null);
                  const recipientNames = msg.toNames || (msg.toName ? [msg.toName] : null);
                  const isPrivate = Array.isArray(recipients) && recipients.length > 0;
                  
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1 px-1 flex-wrap">
                          {!isMe && <span className="text-xs text-gray-500 font-medium">{msg.name}</span>}
                          {isPrivate && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isMe ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                              {isMe ? `→ ${recipientNames?.join(', ')}` : '🔒 Shaxsiy'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 group">
                          {/* Left message gets trash on right, right message gets trash on left */}
                          {!isMe && currentUser.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteChatMessage(msg.id)}
                              className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity order-2"
                              title="Xabarni o'chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? 'order-2' : 'order-1'} ${isPrivate ? (isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-orange-50 border border-orange-200 text-gray-800 rounded-bl-sm') : (isMe ? 'bg-corporate-accent text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm')}`}>
                            {msg.text}
                          </div>
                          {isMe && currentUser.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteChatMessage(msg.id)}
                              className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity order-1"
                              title="Xabarni o'chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(msg.time).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Recipient selector + input */}
            <div className="border-t bg-gray-50 rounded-b-xl relative">
              {/* To: Dropdown selector */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Kimga yuborish:</span>
                  <button
                    type="button"
                    onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 font-semibold transition-all shadow-sm"
                  >
                    <span>
                      {selectedRecipients.length === 0 
                        ? '👥 Hammaga (umumiy)' 
                        : `🔒 Tanlanganlar (${selectedRecipients.length} ta)`}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </div>
                
                {selectedRecipients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedRecipients([])}
                    className="text-[11px] text-red-500 hover:underline font-semibold"
                  >
                    Bekor qilish (Hammaga)
                  </button>
                )}
              </div>

              {/* Checkboxes Dropdown popover */}
              {showRecipientDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowRecipientDropdown(false)} />
                  
                  <div className="absolute bottom-[100%] left-4 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[220px] overflow-y-auto w-[280px] p-2 z-20 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 tracking-wider border-b border-gray-50 mb-1">
                      Xodimlar ro'yxati
                    </div>
                    
                    {/* Everyone option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipients([]);
                        setShowRecipientDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors hover:bg-gray-50 text-gray-700"
                    >
                      <span className="font-semibold flex items-center gap-1.5">👥 Hammaga (umumiy)</span>
                      {selectedRecipients.length === 0 && <Check size={14} className="text-corporate-accent" />}
                    </button>
                    
                    {/* User list */}
                    {allUsers.filter((u: any) => u.username !== currentUser.username).map((u: any) => {
                      const isSelected = selectedRecipients.includes(u.username);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedRecipients(prev => prev.filter(un => un !== u.username));
                            } else {
                              setSelectedRecipients(prev => [...prev, u.username]);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                          <span className="flex items-center gap-1.5">🔒 {u.name}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              
              {/* Text input row */}
              <div className="px-4 pb-4 pt-3 flex gap-3 items-center relative">
                {/* Emoji button & drawer */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 flex items-center justify-center ${showEmojiPicker ? 'text-corporate-accent bg-gray-100' : ''}`}
                    title="Smayliklar"
                  >
                    <Smile size={20} />
                  </button>

                  {showEmojiPicker && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)} />
                      <div className="absolute bottom-[100%] left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-[260px] grid grid-cols-6 gap-2 z-20 mb-2 animate-in slide-in-from-bottom-2 duration-200">
                        {['😀', '😂', '🤣', '😊', '😍', '😘', '😜', '😎', '😉', '😢', '👍', '👎', '❤️', '🔥', '👏', '🙌', '🙏', '🎉', '🌟', '💡', '🤝', '💪', '👀', '✨', '💯', '🚀', '✅', '❌', '⚠️', '📞'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setChatText(prev => prev + emoji)}
                            className="text-xl hover:bg-gray-100 p-1 rounded transition-colors text-center"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <input
                  type="text"
                  value={chatText}
                  onChange={e => setChatText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSendChat(); } }}
                  placeholder={selectedRecipients.length > 0 ? `Tanlangan ${selectedRecipients.length} ta xodimga shaxsiy xabar...` : "Hammaga xabar yozing..."}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-corporate-accent bg-white text-sm"
                  disabled={chatSending}
                />
                <button
                  type="button"
                  onClick={doSendChat}
                  disabled={!chatText.trim() || chatSending}
                  className="bg-corporate-accent text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>


          </div>

        )}

        {/* Password Change Modal */}
        {showPwdModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-1.5">
                  <Key size={18} className="text-corporate-accent" />
                  {pwdTargetUser ? `${pwdTargetUser.name} parolini tahrirlash` : "Parolingizni o'zgartirish"}
                </h3>
                <button 
                  onClick={() => setShowPwdModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">YANGI PAROL</label>
                  <input 
                    type="password" 
                    value={newPwdText} 
                    onChange={e => setNewPwdText(e.target.value)} 
                    placeholder="Kamida 4 ta belgi..." 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm" 
                    required 
                    minLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PAROLNI TASDIQLASH</label>
                  <input 
                    type="password" 
                    value={confirmPwdText} 
                    onChange={e => setConfirmPwdText(e.target.value)} 
                    placeholder="Yangi parolni qayta kiriting..." 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm" 
                    required 
                    minLength={4}
                  />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowPwdModal(false)} 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-md transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-corporate-accent hover:bg-blue-600 text-white text-sm font-semibold rounded-md transition-colors"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* Add Employee Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-1.5">
                  <UserPlus size={18} className="text-corporate-accent" />
                  Yangi xodim qo'shish
                </h3>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAdminAddUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">XODIM F.I.SH.</label>
                  <input 
                    type="text" 
                    value={addName} 
                    onChange={e => setAddName(e.target.value)} 
                    placeholder="Masalan: Umarov Anvar..." 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">TIZIMGA KIRISH LOGINI</label>
                  <input 
                    type="text" 
                    value={addUsername} 
                    onChange={e => setAddUsername(e.target.value)} 
                    placeholder="Masalan: anvar123..." 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PAROL</label>
                  <input 
                    type="password" 
                    value={addPassword} 
                    onChange={e => setAddPassword(e.target.value)} 
                    placeholder="Kamida 4 ta belgi..." 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm" 
                    required 
                    minLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">ROLI (HUQUQI)</label>
                  <select 
                    value={addRole} 
                    onChange={e => setAddRole(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-md focus:ring-corporate-accent focus:border-corporate-accent text-sm bg-white"
                  >
                    <option value="employee">Xodim (Portal + Chat)</option>
                    <option value="admin">Admin (To'liq boshqaruv)</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddUserModal(false)} 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-md transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-corporate-accent hover:bg-blue-600 text-white text-sm font-semibold rounded-md transition-colors"
                  >
                    Qo'shish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;

