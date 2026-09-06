export function buildGoogleAuthorizationUrl({
  clientId,
  origin,
  state,
}: {
  clientId: string;
  origin: string;
  state: string;
}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}/api/auth/callback/google`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export function validateOAuthState(expected: string | undefined, received: string | null) {
  if (!expected || !received || expected !== received) throw new Error("Invalid OAuth state");
}
