const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.use(cors());
app.use(express.json());
// Rasmlarni hammaga ko'rsatish uchun "uploads" papkasini ochiq qilish
app.use('/uploads', express.static(UPLOADS_DIR));

// Rasm yuklash sozlamalari (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const dataFile = path.join(__dirname, 'data.json');

// Initialize data if not exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    news: [],
    projects: [],
    equipment: [],
    vacancies: [],
    applications: [],
    faceIds: [],
    settings: {
      phone: "+998 90 123 45 67",
      email: "info@ung-burgilash.uz",
      address: "Toshkent shahar, Mirobod tumani",
      hikvision_ip: "192.168.1.100",
      hikvision_user: "admin",
      hikvision_pass: "password123"
    }
  }));
}

let db = JSON.parse(fs.readFileSync(dataFile));
if (!db.applications) db.applications = [];
if (!db.faceIds) db.faceIds = [];
if (!db.settings) db.settings = {};
if (!db.settings.hikvision_ip) db.settings.hikvision_ip = "";

const saveDb = () => {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
};

// Ma'lumotlarni o'qish funksiyasi
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ news: [], projects: [], equipment: [], vacancies: [], settings: {} }));
  }
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
};

// Ma'lumotlarni yozish funksiyasi
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Rasm yuklash API (Ixtiyoriy yordamchi endpoint)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Fayl yuklanmadi" });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// --- UNIVERSAL CRUD API ---
const createCrudEndpoints = (resourceName) => {
  // GET
  app.get(`/api/${resourceName}`, (req, res) => {
    const data = readData();
    res.json(data[resourceName] || []);
  });

  // POST (Rasmi bilan yoki rasmsiz)
  app.post(`/api/${resourceName}`, upload.single('image'), (req, res) => {
    const data = readData();
    
    let imageUrl = req.body.img || req.body.image || null; // Eski URL bo'lishi mumkin
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = {
      id: Date.now(),
      ...req.body,
      img: imageUrl // Rasmni saqlash
    };
    
    if(!data[resourceName]) data[resourceName] = [];
    data[resourceName].unshift(newItem); 
    
    writeData(data);
    res.status(201).json(newItem);
  });

  // PUT (Tahrirlash)
  app.put(`/api/${resourceName}/:id`, upload.single('image'), (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    
    if (data[resourceName]) {
      const index = data[resourceName].findIndex(item => item.id === id);
      if (index !== -1) {
        let imageUrl = data[resourceName][index].img; // Eski rasmni saqlab qolish
        if (req.file) {
          imageUrl = `/uploads/${req.file.filename}`; // Yangi rasm yuklansa
        }
        
        data[resourceName][index] = {
          ...data[resourceName][index],
          ...req.body,
          id: id, // ID ni o'zgarmas saqlash
          img: imageUrl
        };
        
        writeData(data);
        return res.json(data[resourceName][index]);
      }
    }
    res.status(404).json({ error: "Topilmadi" });
  });

  // DELETE
  app.delete(`/api/${resourceName}/:id`, (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    if(data[resourceName]) {
      data[resourceName] = data[resourceName].filter(item => item.id !== id);
      writeData(data);
    }
    res.json({ success: true });
  });
};

createCrudEndpoints('news');
createCrudEndpoints('projects');
createCrudEndpoints('equipment');
createCrudEndpoints('vacancies');
createCrudEndpoints('applications');
createCrudEndpoints('faceIds'); // Face ID yuzlar uchun
createCrudEndpoints('messages'); // Aloqa formasi xabarlari uchun

const archiver = require('archiver');

// --- iVMS EXPORT API ---
app.get('/api/faceIds/export', (req, res) => {
  const data = readData();
  const faceIds = data.faceIds || [];
  
  res.attachment('iVMS_Faces.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.on('error', (err) => { res.status(500).send({error: err.message}); });
  archive.pipe(res);

  // iVMS-4200 odatda rasm nomini Employee ID bilan bir xil bo'lishini talab qiladi (Masalan: 98.jpg)
  // Yoki .csv fayl so'raydi. Biz PersonList.csv va rasmlarni bitta papkada yig'amiz.
  let csvContent = "Person ID,Person Name\n";

  faceIds.forEach(person => {
    csvContent += `${person.employeeId},${person.name}\n`;
    
    if (person.img) {
      // url = http://localhost:5000/uploads/filename.jpg
      const filename = person.img.split('/').pop();
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        // Rasmni xodimning ID si bilan nomlab zipta saqlaymiz (Masalan: 98.jpg)
        const ext = path.extname(filename);
        archive.file(filePath, { name: `Faces/${person.employeeId}${ext}` });
      }
    }
  });

  archive.append(csvContent, { name: 'PersonList.csv' });
  archive.finalize();
});

// --- TASHRIFLAR HISOBLAGICHI (VISITOR COUNTER) ---
app.get('/api/visitor-count', (req, res) => {
  const data = readData();
  if (typeof data.visitor_count !== 'number') {
    data.visitor_count = 100; // Realistic starting value
  }
  
  const increment = req.query.increment === 'true';
  if (increment) {
    data.visitor_count += 1;
    writeData(data);
  }
  
  res.json({ count: data.visitor_count });
});

// --- SOZLAMALAR (SETTINGS) ---
app.get('/api/settings', (req, res) => {
  const data = readData();
  res.json(data.settings || {});
});

app.post('/api/settings', upload.any(), (req, res) => {
  const data = readData();
  
  if (!data.settings) data.settings = {};
  
  // Update text fields
  Object.keys(req.body).forEach(key => {
    data.settings[key] = req.body[key];
  });
  
  // Update any images uploaded (req.files is an array because of upload.any())
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      data.settings[file.fieldname] = `/uploads/${file.filename}`;
    });
  }

  writeData(data);
  res.json({ success: true, settings: data.settings });
});

// USERS & AUTH ENDPOINTS
app.post('/api/login', express.json(), (req, res) => {
  const data = readData();
  if (!data.users || data.users.length === 0) {
    data.users = [{ id: 1, username: 'admin', password: 'admin', role: 'superadmin' }];
    writeData(data);
  }
  const { username, password } = req.body;
  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: "Login yoki parol xato" });
  }
});

app.get('/api/users', (req, res) => {
  const data = readData();
  res.json(data.users || []);
});

app.post('/api/users', express.json(), (req, res) => {
  const data = readData();
  if (!data.users) data.users = [];
  const newUser = {
    id: Date.now(),
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  };
  data.users.push(newUser);
  writeData(data);
  res.json(newUser);
});

app.delete('/api/users/:id', (req, res) => {
  const data = readData();
  data.users = data.users.filter(u => u.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

  // --- PORTAL USER REGISTRATION & AUTHENTICATION ---
  app.post('/api/portal/register', express.json(), (req, res) => {
    const data = readData();
    if (!data.portal_users) data.portal_users = [];
    const { name, username, password } = req.body;
    
    const trimmedUsername = (username || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();
    const trimmedName = (name || '').trim();

    if (data.portal_users.some(u => (u.username || '').trim().toLowerCase() === trimmedUsername)) {
      return res.status(400).json({ success: false, message: "Bu login band" });
    }
    
    const isFirstUser = data.portal_users.length === 0;
    const role = req.body.role || ((trimmedUsername === 'admin' || isFirstUser) ? 'admin' : 'employee');
    
    const newUser = { 
      id: Date.now(), 
      name: trimmedName, 
      username: trimmedUsername, 
      password: trimmedPassword, 
      role 
    };
    data.portal_users.push(newUser);
    writeData(data);
    res.json({ success: true, user: { id: newUser.id, name: newUser.name, username: newUser.username, role: newUser.role } });
  });

  app.post('/api/portal/login', express.json(), (req, res) => {
    const data = readData();
    if (!data.portal_users) data.portal_users = [];
    const { username, password } = req.body;
    
    const targetUsername = (username || '').trim().toLowerCase();
    const targetPassword = (password || '').trim();
    
    const user = data.portal_users.find(u => 
      (u.username || '').trim().toLowerCase() === targetUsername && 
      (u.password || '').trim() === targetPassword
    );
    
    if (user) {
      res.json({ success: true, user: { id: user.id, name: user.name, username: user.username, role: user.role || 'employee' } });
    } else {
      res.status(401).json({ success: false, message: "Login yoki parol noto'g'ri" });
    }
  });

  app.get('/api/portal/users', (req, res) => {
    const data = readData();
    res.json(data.portal_users || []);
  });

  app.delete('/api/portal/users/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    if (data.portal_users) {
      data.portal_users = data.portal_users.filter(u => u.id !== id);
      writeData(data);
    }
    res.json({ success: true });
  });

  app.post('/api/portal/change-password', express.json(), (req, res) => {
    const { username, newPassword } = req.body;
    if (!username || !newPassword || !newPassword.trim()) {
      return res.status(400).json({ success: false, message: "Parol bo'sh bo'lishi mumkin emas" });
    }
    const data = readData();
    if (!data.portal_users) data.portal_users = [];
    
    const targetUsername = username.trim().toLowerCase();
    const userIndex = data.portal_users.findIndex(u => (u.username || '').trim().toLowerCase() === targetUsername);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }
    data.portal_users[userIndex].password = newPassword.trim();
    writeData(data);
    res.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" });
  });

  app.post('/api/portal/admin-reset-password', express.json(), (req, res) => {
    const { adminUsername, targetUserId, newPassword } = req.body;
    const data = readData();
    if (!data.portal_users) data.portal_users = [];
    
    const admin = data.portal_users.find(u => (u.username || '').trim().toLowerCase() === adminUsername.trim().toLowerCase());
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Ruxsat etilmagan amal" });
    }

    const userIndex = data.portal_users.findIndex(u => u.id === parseInt(targetUserId));
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "Xodim topilmadi" });
    }

    data.portal_users[userIndex].password = newPassword.trim();
    writeData(data);
    res.json({ success: true, message: "Xodim paroli muvaffaqiyatli yangilandi" });
  });

  app.post('/api/portal/admin-change-role', express.json(), (req, res) => {
    const { adminUsername, targetUserId, newRole } = req.body;
    const data = readData();
    if (!data.portal_users) data.portal_users = [];

    const admin = data.portal_users.find(u => (u.username || '').trim().toLowerCase() === adminUsername.trim().toLowerCase());
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Ruxsat etilmagan amal" });
    }

    const userIndex = data.portal_users.findIndex(u => u.id === parseInt(targetUserId));
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "Xodim topilmadi" });
    }

    data.portal_users[userIndex].role = newRole;
    writeData(data);
    res.json({ success: true, message: "Xodim roli muvaffaqiyatli o'zgartirildi" });
  });

  // --- PORTAL FILE SHARING ---
  app.get('/api/portal/files', (req, res) => {
    const data = readData();
    const username = req.query.username;
    const role = req.query.role;
    let files = data.portal_files || [];
    if (role !== 'admin') {
      files = files.filter(f => f.targetUsername === username);
    }
    res.json(files);
  });

  app.post('/api/portal/files', upload.single('file'), (req, res) => {
    const data = readData();
    if (!data.portal_files) data.portal_files = [];
    
    if (!req.file) return res.status(400).json({ error: "Fayl yuklanmadi" });

    const targets = req.body.targetUsernames 
      ? req.body.targetUsernames.split(',') 
      : (req.body.targetUsername ? [req.body.targetUsername] : []);
    
    if (targets.length === 0) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({ error: "Hech bo'lmaganda bitta qabul qiluvchi tanlanishi kerak" });
    }

    const results = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i].trim();
      if (!target) continue;
      
      let finalFilename = req.file.filename;
      if (i > 0) {
        const ext = path.extname(req.file.filename);
        const base = path.basename(req.file.filename, ext);
        const newFilename = `${base}_copy_${i}_${Date.now()}${ext}`;
        try {
          fs.copyFileSync(
            path.join(UPLOADS_DIR, req.file.filename),
            path.join(UPLOADS_DIR, newFilename)
          );
          finalFilename = newFilename;
        } catch (e) {
          console.error("Fayl nusxalashda xatolik:", e);
          continue;
        }
      }

      const newFile = {
        id: Date.now() + i,
        name: req.body.name || req.file.originalname,
        originalName: req.file.originalname,
        filename: finalFilename,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.body.uploadedBy || 'Xodim',
        targetUsername: target
      };
      
      data.portal_files.push(newFile);
      results.push(newFile);
    }
    
    writeData(data);
    res.status(201).json(results);
  });

  app.get('/api/portal/files/:id/download', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    if (!data.portal_files) data.portal_files = [];
    
    const fileIndex = data.portal_files.findIndex(f => f.id === id);
    if (fileIndex === -1) return res.status(404).json({ error: "Fayl topilmadi yoki allaqachon yuklab olingan" });
    
    const fileRecord = data.portal_files[fileIndex];
    const filePath = path.join(UPLOADS_DIR, fileRecord.filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath, fileRecord.originalName, (err) => {
        if (!err) {
          try { fs.unlinkSync(filePath); } catch (e) { console.error("Fayl ochirishda xatolik:", e); }
          const updatedData = readData();
          updatedData.portal_files = updatedData.portal_files.filter(f => f.id !== id);
          writeData(updatedData);
        }
      });
    } else {
      data.portal_files.splice(fileIndex, 1);
      writeData(data);
      res.status(404).json({ error: "Fayl topilmadi" });
    }
  });

  // --- PORTAL CHAT ---
  app.get('/api/portal/chat', (req, res) => {
    const data = readData();
    const messages = data.portal_chat || [];
    const since = req.query.since ? parseInt(req.query.since) : 0;
    const username = req.query.username || '';
    const role = req.query.role || '';

    let filtered = since ? messages.filter(m => m.id > since) : messages.slice(-200);

    if (role !== 'admin' && username) {
      filtered = filtered.filter(m => {
        const recipients = m.toUsernames || (m.toUsername ? [m.toUsername] : null);
        return (
          !recipients ||
          m.username === username ||
          recipients.includes(username)
        );
      });
    }
    res.json(filtered);
  });

  app.post('/api/portal/chat', express.json(), (req, res) => {
    const { username, name, text, toUsernames, toNames } = req.body;
    if (!username || !text || !text.trim()) return res.status(400).json({ error: 'Xabar bo\'sh bo\'lishi mumkin emas' });
    const data = readData();
    if (!data.portal_chat) data.portal_chat = [];
    const msg = {
      id: Date.now(),
      username,
      name,
      text: text.trim(),
      time: new Date().toISOString(),
      toUsernames: Array.isArray(toUsernames) && toUsernames.length > 0 ? toUsernames : null,
      toNames: Array.isArray(toNames) && toNames.length > 0 ? toNames : null
    };
    data.portal_chat.push(msg);
    if (data.portal_chat.length > 500) data.portal_chat = data.portal_chat.slice(-500);
    writeData(data);
    res.json(msg);
  });

  app.delete('/api/portal/chat/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    if (data.portal_chat) {
      data.portal_chat = data.portal_chat.filter(m => m.id !== id);
      writeData(data);
    }
    res.json({ success: true });
  });

  app.delete('/api/portal/chat', (req, res) => {
    const data = readData();
    data.portal_chat = [];
    writeData(data);
    res.json({ success: true });
  });

// Front-end statik fayllari
app.use(express.static(path.join(__dirname, '../dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const finalPort = process.env.SOCKET || process.env.PORT || 5000;
if (typeof finalPort === 'string' && fs.existsSync(finalPort)) {
  try { fs.unlinkSync(finalPort); } catch(e) {}
}

app.listen(finalPort, () => {
  console.log(`Backend server ${finalPort} da ishga tushdi.`);
  if (typeof finalPort === 'string') {
    try { fs.chmodSync(finalPort, '0777'); } catch(e) {}
  }
});
