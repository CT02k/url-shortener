import { NextRequest, NextResponse } from "next/server";
import { env } from "../lib/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const redirect = new URL(
    `/shorten/${slug}/redirect`,
    env.NEXT_PUBLIC_BACKEND_URL,
  );

  return NextResponse.redirect(redirect);
}
