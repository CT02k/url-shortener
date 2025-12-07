import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { env } from "./config";
import { clearToken } from "./getToken";

export interface UrlShortenerOptions {
  token?: string;
  onUnauthorized?: () => void | Promise<void>;
}

export default class UrlShortener {
  token?: string;
  onUnauthorized?: () => void;

  constructor({ token, onUnauthorized }: UrlShortenerOptions) {
    this.token = token;
    this.onUnauthorized = onUnauthorized ?? clearToken;
  }

  setToken(token: string) {
    this.token = token;
  }

  async request({
    path,
    options = {},
  }: {
    path: string;
    options?: AxiosRequestConfig;
  }) {
    const headers: RawAxiosRequestHeaders = {
      "Content-Type": "application/json",
      ...((options.headers as RawAxiosRequestHeaders) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = new URL(path, env.NEXT_PUBLIC_BACKEND_URL).toString();

    console.log("Request to " + url);

    try {
      const response = await axios(url, {
        ...options,
        headers,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401 && this.onUnauthorized) {
          await this.onUnauthorized();
        }
        return err.response.data;
      }
      return { message: "Internal error" };
    }
  }

  createShortUrl(redirect: string) {
    return this.request({
      path: `/shorten`,
      options: {
        method: "POST",
        data: {
          redirect,
        },
      },
    });
  }

  getUrlStats(
    id: string,
    query?: {
      range?: "hour" | "day" | "week" | "month";
      from?: string | Date;
      to?: string | Date;
    },
  ) {
    return this.request({
      path: `/shorten/${id}/stats`,
      options: {
        params: query,
      },
    });
  }

  getShortUrl(slug: string) {
    return this.request({
      path: `/shorten/${slug}`,
    });
  }

  registerAccount({ data }: { data: { username: string; password: string } }) {
    return this.request({
      path: `/auth/register`,
      options: {
        method: "POST",
        data,
      },
    });
  }

  loginAccount({ data }: { data: { username: string; password: string } }) {
    return this.request({
      path: `/auth/login`,
      options: {
        method: "POST",
        data,
      },
    });
  }

  getProfile() {
    return this.request({
      path: `/me`,
    });
  }

  listMyLinks({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  } = {}) {
    return this.request({
      path: `/me/links`,
      options: {
        params: { page, limit },
      },
    });
  }

  deleteMyLink(slug: string) {
    return this.request({
      path: `/me/links/${slug}`,
      options: {
        method: "DELETE",
      },
    });
  }
}
