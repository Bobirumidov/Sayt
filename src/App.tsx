import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import About from './components/About';
import Activities from './components/Activities';
import Equipment from './components/Equipment';
import Projects from './components/Projects';
import Monitoring from './components/Monitoring';
import Safety from './components/Safety';
import News from './components/News';
import Vacancies from './components/Vacancies';
import Contact from './components/Contact';
import UsefulLinks from './components/UsefulLinks';
import Footer from './components/Footer';
import FaceId from './components/FaceId';
import Chatbot from './components/Chatbot';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminEquipment from './components/admin/AdminEquipment';
import AdminNews from './components/admin/AdminNews';
import AdminProjects from './components/admin/AdminProjects';
import AdminVacancies from './components/admin/AdminVacancies';
import AdminMessages from './components/admin/AdminMessages';
import AdminSettings from './components/admin/AdminSettings';
import AdminFaceId from './components/admin/AdminFaceId';
import AdminUsers from './components/admin/AdminUsers';
import AdminManagement from './components/admin/AdminManagement';
import AdminSitemap from './components/admin/AdminSitemap';

import NewsDetail from './components/NewsDetail';
import Portal from './components/Portal';
import Management from './components/Management';
import ClockWidget from './components/ClockWidget';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Hero />
      <Statistics />
      <About />
      <News />
      <Activities />
      <Equipment />
      <Projects />
      <Monitoring />
      <Safety />
      <Vacancies />
      <Contact />
      <UsefulLinks />
    </main>
    <Footer />
    <Chatbot />
    <ClockWidget />
    {/* Floating Portal link bottom-left */}
    <a 
      href="/portal"
      className="fixed bottom-6 left-6 px-4 py-3 rounded-full bg-corporate-dark/95 text-white shadow-xl hover:bg-corporate-accent hover:scale-105 transition-all z-50 flex items-center gap-2 border border-white/10 backdrop-blur-sm"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-corporate-accent animate-pulse"></span>
      <span className="text-xs font-semibold tracking-wide">Xodimlar Portali</span>
    </a>
  </div>
);

const DetailLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <Chatbot />
    <ClockWidget />
    {/* Floating Portal link bottom-left */}
    <a 
      href="/portal"
      className="fixed bottom-6 left-6 px-4 py-3 rounded-full bg-corporate-dark/95 text-white shadow-xl hover:bg-corporate-accent hover:scale-105 transition-all z-50 flex items-center gap-2 border border-white/10 backdrop-blur-sm"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-corporate-accent animate-pulse"></span>
      <span className="text-xs font-semibold tracking-wide">Xodimlar Portali</span>
    </a>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route path="/news/:id" element={<DetailLayout><NewsDetail /></DetailLayout>} />
      <Route path="/rahbariyat" element={<DetailLayout><Management /></DetailLayout>} />
      <Route path="/portal" element={<DetailLayout><Portal /></DetailLayout>} />
      <Route path="/face-registration" element={<DetailLayout><FaceId /></DetailLayout>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="equipment" element={<AdminEquipment />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="vacancies" element={<AdminVacancies />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="face-id" element={<AdminFaceId />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="sitemap" element={<AdminSitemap />} />
        <Route path="management" element={<AdminManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
