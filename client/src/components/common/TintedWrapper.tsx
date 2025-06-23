import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { ReactElement, MouseEvent } from 'react';

interface TintedWrapperProps {
  children: React.ReactNode;
}

type PropsWithOnClick = {
  onClick?: (e: MouseEvent) => void;
  [key: string]: unknown;
};

const TintedWrapper = ({ children }: TintedWrapperProps) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setCoords({ x: centerX, y: centerY });

    if (
      React.isValidElement(children) &&
      typeof (children as ReactElement<PropsWithOnClick>).props.onClick ===
        'function'
    ) {
      const childOnClick = (children as ReactElement<PropsWithOnClick>).props
        .onClick;
      if (typeof childOnClick === 'function') {
        childOnClick(e);
      }
    }
  };

  useEffect(() => {
    if (coords) {
      const timer = setTimeout(() => {
        setCoords(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [coords]);

  if (!React.isValidElement(children)) return null;

  const enhanced = React.cloneElement(
    children as ReactElement<PropsWithOnClick>,
    {
      onClick: handleClick,
    },
  );

  return (
    <>
      {coords &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]">
            <span
              className="absolute rounded-full bg-black/40 animate-tint"
              style={{
                top: coords.y - 13,
                left: coords.x - 13,
                width: 26,
                height: 26,
              }}
            />
          </div>,
          document.body,
        )}
      {enhanced}
    </>
  );
};

export default TintedWrapper;
