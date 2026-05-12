import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function AppLayout() {
  const { citizen } = useUser();

  return (
    <div className="app-layout" data-theme={citizen.theme}>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signalements" element={<Reports />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
