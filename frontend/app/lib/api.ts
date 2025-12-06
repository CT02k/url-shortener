import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { env } from "./config";

export interface UrlShortenerOptions {
  token?: string;
}

export default class UrlShortener {
  token?: string;

  constructor({ token }: UrlShortenerOptions) {
    this.token = token;
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
      if (err.response) return err.response.data;
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

  getUrlStats(id: string) {
    return this.request({
      path: `/shorten/${id}/stats`,
    });
  }
}
