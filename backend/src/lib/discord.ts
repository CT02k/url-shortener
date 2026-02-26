import axios from "axios";
import { env } from "./config";

export default class DiscordWebhook {
  public async sendAlert(error: unknown): Promise<void> {
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

    try {
      await axios.post(env.DISCORD_WEBHOOK_URL, message, { timeout: 5000 });
    } catch (err) {
      console.error("Discord webhook failed:", err);
    }
  }
}
