import { z } from "zod";

import type { RegistrationRequest } from "./types";

const emailSchema = z
  .string()
  .email("Masukkan alamat email yang valid.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const registrationSchema = z
  .object({
    role: z.enum(["TALENT", "BUSINESS"], {
      message: "Pilih peran Talent atau UMKM.",
    }),
    fullName: z.string().trim().min(1, "Nama lengkap wajib diisi."),
    email: emailSchema,
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
    termsAccepted: z.literal(true, {
      message: "Anda harus menyetujui Syarat dan Ketentuan.",
    }),
    privacyAccepted: z.literal(true, {
      message: "Anda harus menyetujui pemrosesan data pribadi.",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function toRegistrationRequest(
  input: RegistrationInput,
): RegistrationRequest {
  const {
    role,
    fullName,
    email,
    password,
    termsAccepted,
    privacyAccepted,
  } = input;

  return {
    role,
    fullName,
    email,
    password,
    termsAccepted,
    privacyAccepted,
  };
}
