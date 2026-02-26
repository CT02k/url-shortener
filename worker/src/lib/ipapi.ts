import axios from "axios";
import { env } from "./config";

const PRIVATE_IP_REGEX =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|::1$|::1\/128$|::ffff:127\.|fc00:|fd00:|fe80:)/i;

const IPAPI_URL = "https://ip.hackclub.com/ip";

export const lookupCountryByIp = async (
  ip?: string,
): Promise<
  | {
      country: string;
      countryName: string;
    }
  | undefined
> => {
  if (!ip) return undefined;
  if (env.NODE_ENV !== "development" && PRIVATE_IP_REGEX.test(ip))
    return undefined;

  try {
    const url =
      env.NODE_ENV !== "development"
        ? `${IPAPI_URL}/${encodeURIComponent(ip)}`
        : IPAPI_URL;

    const { data } = await axios.get(url, { timeout: 2000 });

    const country = data?.country_iso_code;
    const countryName = data?.country_name;

    if (typeof country === "string" && country.length) {
      return {
        country,
        countryName,
      };
    }
  } catch {}

  return undefined;
};
