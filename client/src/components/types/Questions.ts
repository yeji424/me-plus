export type Question = {
  id: number;
  text: string;
  tag: string;
  type: 'binary' | 'multiple';
  options?: string[];
  tip: {
    highlight: string;
    rest: string;
  };
};
