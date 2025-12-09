import cron from "node-cron";

import test from "./test";
import { CronData } from "./types";

const crons: CronData[] = [test];

export const registerJobs = () => {
  console.log("[CRON] Loading cronjobs");

  crons.forEach(({ data, execute }) => {
    if (data.condition) {
      cron.schedule(data.expression, execute);

      console.log(`[CRON] Loaded ${data.name}`);
    }
  });
};
