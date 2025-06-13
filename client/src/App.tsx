import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PlanChatTester from './components/ChatTester';
import ChatbotPage from './pages/ChatbotPage';
import PlanTestPage from './pages/PlanTestPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlanChatTester />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/plan-test" element={<PlanTestPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
