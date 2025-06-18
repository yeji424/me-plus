export const parseMarkedTextToChars = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const chars: { char: string; isBold: boolean }[] = [];

  parts.forEach((part) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const content = isBold ? part.slice(2, -2) : part;

    for (const ch of content) {
      chars.push({ char: ch === '\n' ? '\n' : ch, isBold });
    }
  });

  return chars;
};
