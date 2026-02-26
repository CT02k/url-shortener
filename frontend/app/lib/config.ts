const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing "${name}" env variable.`);
  }
  return value;
};

export const env = {
  NEXT_PUBLIC_BACKEND_URL: required(
    process.env.NEXT_PUBLIC_BACKEND_URL,
    "NEXT_PUBLIC_BACKEND_URL",
  ),
  NEXT_PUBLIC_FRONTEND_URL: required(
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "NEXT_PUBLIC_FRONTEND_URL",
  ),
  BACKEND_INTERNAL_URL:
    process.env.BACKEND_INTERNAL_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL,
};
