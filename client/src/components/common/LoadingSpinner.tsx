const LoadingSpinner = () => {
  return (
    // 채팅 화면에 띄워야한다면 주석을 해제해보세요
    <div className="fixed top-[50vh] left-1/2 -translate-x-1/2 z-[999]">
      <div className="loader" aria-label="Loading" role="status" />
    </div>
  );
};

export default LoadingSpinner;
