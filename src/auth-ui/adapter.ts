import type { AuthResult, AuthUiAdapter } from "./types";

const unavailableResult = (): AuthResult => ({
  ok: false,
  code: "AUTH_NOT_CONFIGURED",
  message: "Autentikasi belum dikonfigurasi.",
});

export const unavailableAuthAdapter: AuthUiAdapter = {
  async loginWithCredentials() {
    return unavailableResult();
  },
  async loginWithGoogle() {
    return unavailableResult();
  },
  async register() {
    return unavailableResult();
  },
  async requestPasswordReset() {
    return {
      ok: false,
      message: "Layanan reset kata sandi belum dikonfigurasi.",
    };
  },
  async logout() {
    return {
      ok: false,
      message: "Autentikasi belum dikonfigurasi; tidak ada sesi untuk diakhiri.",
    };
  },
};
