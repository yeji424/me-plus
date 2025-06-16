import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import ChatTestPage from './pages/ChatTestPage';
import ChatbotPage from './pages/ChatbotPage';
import PlanTestPage from './pages/PlanTestPage';
import ComparePage from './pages/ComparePage';
import Footer from './components/common/Footer';

const MainLayout = () => {
  return (
    <>
      <div className=" min-h-screen flex flex-col">
        <main className="flex-grow mt-[55px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ChatTestPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="plan-test" element={<PlanTestPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
