const TestResultPage = () => {
  const saved = localStorage.getItem('recommendedPlan');
  const plan = saved ? JSON.parse(saved) : null;
  const { id, name } = plan || {};

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
      <h1 className="text-2xl font-bold text-primary">🎉 추천 요금제는?</h1>
      <div className="mt-6 p-6 bg-white shadow-lg rounded-xl border w-full max-w-md">
        <p className="text-lg font-semibold text-gray-800">
          {name || '기본 요금제'}
        </p>
        <p className="text-sm text-gray-500 mt-2">요금제 코드: {id}</p>
      </div>
    </div>
  );
};

export default TestResultPage;
