import { env } from "../../lib/config";
import { Cron, CronFunc } from "../types";

const data: Cron = {
  name: "API keys leak search",
  expression: "* */5 * * *",
  condition: !!env.GITHUB_SEARCH_TOKEN,
};

const execute: CronFunc = async () => {
  console.log("[CRON] TEST");
};

export default {
  data,
  execute,
};
