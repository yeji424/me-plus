import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import ChatTestPage from './pages/ChatTestPage';
import ChatbotPage from './pages/ChatbotPage';
import TestFirstPage from './pages/TestFirstPage';
import TestWaitingPage from './pages/TestWaitingPage';
import TestPage from './pages/TestPage';
import ComparePage from './pages/ComparePage';
import TestResultPage from './pages/TestResultPage';
import MainPage from './pages/MainPage';
import Footer from './components/common/Footer';
import ServiceGuidePage from './pages/ServiceGuidePage';

const MainLayout = () => {
  return (
    <>
      <div className="pt-[50px] min-h-screen flex flex-col">
        <main
          className="flex-1"
          style={{ minHeight: 'calc(100vh - 50px - 80px)' }}
        >
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
          <Route index element={<MainPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="plan-test" element={<TestFirstPage />} />
          <Route path="test" element={<TestPage />} />
          <Route path="test-wait" element={<TestWaitingPage />} />
          <Route path="test-result" element={<TestResultPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="service-guide" element={<ServiceGuidePage />} />
          <Route path="/chat-test" element={<ChatTestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
