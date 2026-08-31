export type AuthRole = "TALENT" | "BUSINESS" | "ADMIN";

export type PublicRegistrationRole = Exclude<AuthRole, "ADMIN">;

export type AuthUser = {
  id: string;
  displayName: string;
  email: string;
  role: AuthRole;
};

export type AuthResult =
  | { ok: true; user: AuthUser }
  | {
      ok: false;
      code:
        | "INVALID_CREDENTIALS"
        | "ACCOUNT_SUSPENDED"
        | "ROLE_REVOKED"
        | "AUTH_NOT_CONFIGURED"
        | "PROVIDER_UNAVAILABLE";
      message: string;
    };

export type RegistrationRequest = {
  role: PublicRegistrationRole;
  fullName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

export type AuthUiAdapter = {
  loginWithCredentials(input: {
    email: string;
    password: string;
  }): Promise<AuthResult>;
  loginWithGoogle(): Promise<AuthResult>;
  register(input: RegistrationRequest): Promise<AuthResult>;
  requestPasswordReset(
    email: string,
  ): Promise<{ ok: boolean; message: string }>;
  logout(): Promise<{ ok: boolean; message?: string }>;
};
