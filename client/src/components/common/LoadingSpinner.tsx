const LoadingSpinner = () => {
  return (
    <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-[999]">
      <div className="loader" aria-label="Loading" role="status" />
    </div>
  );
};

export default LoadingSpinner;
