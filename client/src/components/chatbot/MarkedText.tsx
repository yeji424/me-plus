interface MarkedChar {
  char: string;
  isBold: boolean;
}

interface MarkedTextProps {
  chars: MarkedChar[];
  withAnimation?: boolean;
}

const MarkedText = ({ chars, withAnimation = false }: MarkedTextProps) => {
  return (
    <>
      {chars.map((item, idx) =>
        item.char === '\n' ? (
          <br key={idx} />
        ) : (
          <span
            key={idx}
            className={`${item.isBold ? 'text-primary-pink' : ''} ${withAnimation ? 'fade-in' : ''}`}
            style={
              withAnimation ? { animationDelay: `${idx * 10}ms` } : undefined
            }
          >
            {item.char}
          </span>
        ),
      )}
    </>
  );
};

export default MarkedText;
