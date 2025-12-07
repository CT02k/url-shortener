import axios from "axios";

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
  if (PRIVATE_IP_REGEX.test(ip)) return undefined;

  try {
    const { data } = await axios.get(`${IPAPI_URL}/${encodeURIComponent(ip)}`, {
      timeout: 2000,
    });

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
