"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const browserCookieStore = (globalThis as { cookieStore?: any }).cookieStore;

const getFromDocument = () => {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

  return tokenCookie?.split("=")[1];
};

export async function setToken(token: string) {
  if (browserCookieStore?.set) {
    await browserCookieStore.set({
      name: "token",
      value: token,
      path: "/",
    });
    return;
  }

  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; SameSite=Lax`;
  }
}

export async function clearToken() {
  if (browserCookieStore?.delete) {
    try {
      await browserCookieStore.delete("token");
      return;
    } catch (err) {
      console.warn("Failed to delete token with cookieStore", err);
    }
  }

  if (typeof document !== "undefined") {
    document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
  }
}

export default async function getToken() {
  try {
    if (browserCookieStore?.get) {
      const token = await browserCookieStore.get("token");
      return token?.value;
    }
  } catch (err) {
    console.warn("Failed to read cookieStore token", err);
  }

  return getFromDocument();
}
