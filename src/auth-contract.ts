export const SESSION_COOKIE_NAME = "authjs.session-token";
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: true,
};

export function isDatabaseAuthConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET);
}
