import { env } from "../../lib/config";
import { Cron, CronFunc } from "../types";

const data: Cron = {
  name: "TEST",
  expression: "* */5 * * *",
  condition: false,
};

const execute: CronFunc = async () => {
  console.log("[CRON] TEST");
};

export default {
  data,
  execute,
};
