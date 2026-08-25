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

// Front-end statik fayllari
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server http://localhost:${PORT} da ishga tushdi.`);
});
