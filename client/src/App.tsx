import PlanChatTester from './components/ChatTester';

function App() {
  return (
    <div>
      <div className="bg-blue-100">
      <h1 className="text-center text-gray700 mb-8">
        Tailwind CSS 테스트 중입니다
      </h1>
      <p className="text-lg text-gray-400 mb-4">
        이 문장은 Tailwind의  기본 텍스트 스타일이 적용돼야 합니다.
      </p>
      <button className="px-4 py-2 bg-primary-pink-40 text-white rounded hover:bg-primary-pink transition">
        눌러보세요
      </button>
      </div>
      {/* PlanChatTester 컴포넌트 렌더링 */}
      <PlanChatTester />
    </div>
  );
}

export default App;
