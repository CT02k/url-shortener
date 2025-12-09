import axios from "axios";
import { env } from "./config";

export default class DiscordWebhook {
  public sendAlert(error: any) {
    if (!env.DISCORD_WEBHOOK_URL) return;

    const embed = {
      title: "Error Logger",
      description: `\`\`\`${error}\`\`\`\``,
      color: 0xff0000,
    };

    const message = {
      content: "<@859518290396184597>",
      embeds: [embed],
    };

    axios.post(env.DISCORD_WEBHOOK_URL, message);
  }
}
