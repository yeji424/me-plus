import React, { useEffect, useRef, useState } from 'react';

interface BenefitTextProps {
  text: string;
}

const BenefitText: React.FC<BenefitTextProps> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkOverflow = () => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    }
  };

  useEffect(() => {
    checkOverflow();

    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div>
      <p ref={textRef} className={`${!expanded ? 'clamped' : ''}`}>
        {text}
      </p>

      {isOverflowing && (
        <button className="toggleBtn" onClick={toggleExpanded}>
          {expanded ? '간단히' : '더보기'}
        </button>
      )}
    </div>
  );
};

export default BenefitText;
