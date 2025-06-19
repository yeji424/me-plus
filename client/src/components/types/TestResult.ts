export type TestPlan = {
  id: string;
  name: string;
  condition: (answers: { [key: number]: string }) => boolean;
};
