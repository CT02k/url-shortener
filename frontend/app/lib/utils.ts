import { env } from "./config";

export const shortUrlFor = (slug: string) =>
  new URL(slug, env.NEXT_PUBLIC_FRONTEND_URL).toString();
