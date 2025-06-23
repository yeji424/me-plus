export type Answer = string;

export type PlanResult = {
  id: string;
  name: string;
  description: string;
  priority: number;
  dataUsage: number;
  callUsage: number;
  messageUsage: number;
  price: number;
  tagLine?: string;
  link: string;
};
