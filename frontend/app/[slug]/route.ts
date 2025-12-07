import { NextRequest, NextResponse } from "next/server";
import { env } from "../lib/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const headerReferer = req.headers.get("referer");

  const headerOrigin = req.headers.get("origin");

  const refFromParam = req.nextUrl.searchParams.get("ref");

  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");

  let fallbackForward = null;

  if (forwardedHost && forwardedProto) {
    fallbackForward = `${forwardedProto}://${forwardedHost}`;
  }

  const ref =
    headerReferer ??
    refFromParam ??
    headerOrigin ??
    fallbackForward ??
    "unknown";

  const redirect = new URL(
    `/shorten/${slug}/redirect`,
    env.NEXT_PUBLIC_BACKEND_URL,
  );

  redirect.searchParams.set("ref", ref);

  return NextResponse.redirect(redirect);
}
