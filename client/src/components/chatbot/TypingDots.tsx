const TypingDots = () => {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[999]">
      <div className="relative w-[26px] h-[6px]">
        <span className="dot left-0" />
        <span className="dot left-[10px]" style={{ animationDelay: '0.2s' }} />
        <span className="dot left-[20px]" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default TypingDots;
