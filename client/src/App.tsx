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
import TestPage from './pages/TestPage';
import ComparePage from './pages/ComparePage';
import MainPage from './pages/MainPage';
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
          <Route index element={<MainPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="plan-test" element={<TestFirstPage />} />
          <Route path="test1" element={<TestPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="/chat-test" element={<ChatTestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
