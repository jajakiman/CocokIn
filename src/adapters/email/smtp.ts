import nodemailer from "nodemailer";

export async function sendPasswordResetEmail({ email, resetUrl }: { email: string; resetUrl: string }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const from = process.env.EMAIL_FROM ?? (user ? `CocokIn <${user}>` : undefined);
  if (!user || !pass || !from) throw new Error("Gmail SMTP belum dikonfigurasi");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Atur ulang kata sandi CocokIn",
    text: `Atur ulang kata sandi CocokIn melalui tautan berikut: ${resetUrl}\n\nTautan berlaku selama 1 jam dan hanya dapat digunakan sekali.`,
    html: `<p>Permintaan atur ulang kata sandi CocokIn telah diterima.</p><p><a href="${resetUrl}">Atur ulang kata sandi</a></p><p>Tautan berlaku selama 1 jam dan hanya dapat digunakan sekali. Abaikan email ini jika Anda tidak membuat permintaan tersebut.</p>`,
  });
}

export async function sendEmailVerificationEmail({ email, verificationUrl }: { email: string; verificationUrl: string }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const from = process.env.EMAIL_FROM ?? (user ? `CocokIn <${user}>` : undefined);
  if (!user || !pass || !from) throw new Error("Email provider belum dikonfigurasi");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verifikasi email akun CocokIn",
    text: `Verifikasi email akun CocokIn melalui tautan berikut: ${verificationUrl}\n\nTautan berlaku selama 24 jam dan hanya dapat digunakan sekali.`,
    html: `<p>Selamat datang di CocokIn.</p><p><a href="${verificationUrl}">Verifikasi alamat email</a></p><p>Tautan berlaku selama 24 jam dan hanya dapat digunakan sekali.</p>`,
  });
}
