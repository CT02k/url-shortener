import { TaskFn } from "node-cron";

export interface Cron {
  name: string;
  expression: string;
  condition: boolean;
}

export type CronFunc = TaskFn;

export type CronData = {
  data: Cron;
  execute: CronFunc;
};
