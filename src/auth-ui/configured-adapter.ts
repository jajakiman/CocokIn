import type { AuthResult, AuthUiAdapter, RegistrationRequest } from "./types";

type Dependencies = {
  fetch: typeof globalThis.fetch;
  redirect: (url: string) => void;
};

const unavailable: AuthResult = {
  ok: false,
  code: "PROVIDER_UNAVAILABLE",
  message: "Layanan autentikasi sedang tidak tersedia.",
};

function isAuthResult(value: unknown): value is AuthResult {
  if (!value || typeof value !== "object" || !("ok" in value)) return false;
  const result = value as Record<string, unknown>;
  if (result.ok === false) return typeof result.code === "string" && typeof result.message === "string";
  if (result.ok !== true || !result.user || typeof result.user !== "object") return false;
  const user = result.user as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.displayName === "string" &&
    typeof user.email === "string" &&
    (user.role === "TALENT" || user.role === "BUSINESS" || user.role === "ADMIN")
  );
}

export function createConfiguredAuthAdapter(dependencies?: Partial<Dependencies>): AuthUiAdapter {
  const fetcher = dependencies?.fetch ?? globalThis.fetch.bind(globalThis);
  const redirect = dependencies?.redirect ?? ((url: string) => window.location.assign(url));

  async function post(path: string, input: object): Promise<AuthResult> {
    try {
      const response = await fetcher(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const result: unknown = await response.json();
      return isAuthResult(result) ? result : unavailable;
    } catch {
      return unavailable;
    }
  }

  async function authenticate(path: string, input: object) {
    const result = await post(path, input);
    if (result.ok) {
      redirect(result.user.role === "BUSINESS" ? "/business" : result.user.role === "ADMIN" ? "/admin" : "/talent");
    }
    return result;
  }

  return {
    loginWithCredentials(input) {
      return authenticate("/api/auth/credentials", input);
    },
    loginWithGoogle() {
      redirect("/api/auth/signin/google?callbackUrl=%2F");
      return new Promise<AuthResult>(() => {});
    },
    register(input: RegistrationRequest) {
      return authenticate("/api/auth/register", input);
    },
    async requestPasswordReset() {
      return { ok: false, message: "Layanan reset kata sandi belum dikonfigurasi." };
    },
    async logout() {
      try {
        const response = await fetcher("/api/auth/logout", { method: "POST" });
        const result: unknown = await response.json();
        return result && typeof result === "object" && "ok" in result && result.ok === true
          ? { ok: true }
          : { ok: false, message: "Sesi tidak dapat diakhiri." };
      } catch {
        return { ok: false, message: "Sesi tidak dapat diakhiri." };
      }
    },
  };
}

export const configuredAuthAdapter = createConfiguredAuthAdapter();
