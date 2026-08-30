"use client";

import { GoogleLogo, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { loginSchema } from "@/src/auth-ui/schemas";
import type { AuthResult, AuthUiAdapter } from "@/src/auth-ui/types";

import { PasswordField } from "./password-field";

type LoginField = "email" | "password";
type LoginErrors = Partial<Record<LoginField, string>>;

function validationErrors(form: HTMLFormElement): LoginErrors {
  const data = new FormData(form);
  const result = loginSchema.safeParse({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (result.success) return {};

  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path[0], issue.message]),
  );
}

export function LoginForm({ adapter }: { adapter: AuthUiAdapter }) {
  const [errors, setErrors] = useState<LoginErrors>({});
  const [failure, setFailure] = useState<string>();
  const [pendingAction, setPendingAction] = useState<"credentials" | "google">();
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const isPending = pendingAction !== undefined;

  useEffect(() => {
    if (invalidAttempt > 0) summaryRef.current?.focus();
  }, [invalidAttempt]);

  async function applyResult(result: AuthResult) {
    if (!result.ok) {
      setFailure(result.message);
    } else {
      if (result.user.role === "BUSINESS") {
        window.location.assign("/business");
      } else if (result.user.role === "TALENT") {
        window.location.assign("/talent");
      } else if (result.user.role === "ADMIN") {
        window.location.assign("/admin");
      } else {
        window.location.assign("/");
      }
    }
  }

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validationErrors(event.currentTarget);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setInvalidAttempt((attempt) => attempt + 1);
      return;
    }

    const data = new FormData(event.currentTarget);
    setPendingAction("credentials");
    try {
      await applyResult(
        await adapter.loginWithCredentials({
          email: String(data.get("email")),
          password: String(data.get("password")),
        }),
      );
    } finally {
      setPendingAction(undefined);
    }
  }

  async function submitGoogle() {
    setPendingAction("google");
    try {
      await applyResult(await adapter.loginWithGoogle());
    } finally {
      setPendingAction(undefined);
    }
  }

  const errorEntries = Object.entries(errors) as [LoginField, string][];

  return (
    <form className="auth-form" noValidate onSubmit={submitCredentials}>
      {failure ? (
        <div className="auth-alert" role="alert">
          <WarningCircle aria-hidden="true" size={20} />
          <p>{failure}</p>
        </div>
      ) : null}
      {errorEntries.length > 0 ? (
        <div
          aria-label="Periksa kembali formulir"
          className="auth-error-summary"
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
        >
          <strong>Periksa kembali formulir</strong>
          <ul>
            {errorEntries.map(([field, message]) => (
              <li key={field}><a href={`#login-${field}`}>{message}</a></li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        className="auth-google-button"
        disabled={isPending}
        onClick={submitGoogle}
        type="button"
      >
        <GoogleLogo aria-hidden="true" size={20} weight="bold" />
        {pendingAction === "google" ? "Menghubungkan Google..." : "Masuk dengan Google"}
      </button>
      <div className="auth-divider"><span>atau gunakan email</span></div>
      <div className="auth-field">
        <label htmlFor="login-email">Email</label>
        <input
          aria-describedby={errors.email ? "login-email-error" : undefined}
          aria-invalid={errors.email ? true : undefined}
          autoComplete="email"
          disabled={isPending}
          id="login-email"
          name="email"
          type="email"
        />
        {errors.email ? <p className="auth-field__error" id="login-email-error">{errors.email}</p> : null}
      </div>
      <PasswordField
        autoComplete="current-password"
        disabled={isPending}
        error={errors.password}
        id="login-password"
        label="Kata sandi"
        name="password"
      />
      <div className="auth-form__aside-link">
        <Link href="/forgot-password">Lupa kata sandi?</Link>
      </div>
      <button className="auth-submit" disabled={isPending} type="submit">
        {pendingAction === "credentials" ? "Memproses..." : "Masuk"}
      </button>
      <p className="auth-form__switch">Belum punya akun? <Link href="/register">Daftar sekarang</Link></p>
    </form>
  );
}

export function UnavailableLoginForm() {
  return <LoginForm adapter={unavailableAuthAdapter} />;
}
