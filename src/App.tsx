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
import Footer from './components/Footer';
import FaceId from './components/FaceId';

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

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Hero />
      <Statistics />
      <About />
      <Activities />
      <Equipment />
      <Projects />
      <Monitoring />
      <Safety />
      <News />
      <Vacancies />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route path="/face-registration" element={<><Header /><FaceId /><Footer /></>} />
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
      </Route>
    </Routes>
  );
}

export default App;
