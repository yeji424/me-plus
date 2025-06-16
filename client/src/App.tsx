import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ChatTestPage from './pages/ChatTestPage';
import ChatbotPage from './pages/ChatbotPage';
import PlanTestPage from './pages/PlanTestPage';
import ComparePage from './pages/ComparePage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/plan-test" element={<PlanTestPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/chat-test" element={<ChatTestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
