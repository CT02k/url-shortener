"use client";

export default async function getToken() {
  const token = await cookieStore.get("token");

  return token?.value;
}
