import React, { useRef, useState, useEffect } from 'react';

interface CategoryCarouselProps {
  categoryList: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Carousel: React.FC<CategoryCarouselProps> = ({
  categoryList,
  activeIndex,
  setActiveIndex,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setDragDistance(0);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!scrollContainerRef.current) return;
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = x - startX;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
      setDragDistance(Math.abs(walk));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, scrollLeft, startX]);

  const handleCardClick = (idx: number) => {
    if (dragDistance < 5) {
      setActiveIndex(idx);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="w-full flex gap-2 overflow-x-auto py-3 -mx-5 px-5 text-xs select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: 'pointer',
      }}
      onMouseDown={handleMouseDown}
    >
      {categoryList.map((label, idx) => (
        <div
          key={idx}
          className={`h-9 rounded-xl shadow-basic flex justify-center items-center cursor-pointer transition-colors duration-100 px-[13px] whitespace-nowrap ${
            activeIndex === idx
              ? 'bg-secondary-purple-60 text-background-40'
              : 'bg-white'
          }`}
          onClick={() => handleCardClick(idx)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
