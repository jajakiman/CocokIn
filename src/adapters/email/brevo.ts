type TransactionalEmail = {
  email: string;
  subject: string;
  textContent: string;
  htmlContent: string;
};

async function sendTransactionalEmail(message: TransactionalEmail) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "CocokIn";
  if (!apiKey || !senderEmail) throw new Error("Brevo belum dikonfigurasi");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: message.email }],
      subject: message.subject,
      textContent: message.textContent,
      htmlContent: message.htmlContent,
    }),
  });

  if (!response.ok) {
    console.error("[BREVO DELIVERY ERROR]", { status: response.status });
    throw new Error(`Brevo menolak pengiriman email (${response.status})`);
  }
}

function emailTemplate({ title, description, actionLabel, actionUrl, expiry }: {
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  expiry: string;
}) {
  return `<!doctype html><html lang="id"><body style="margin:0;background:#F7F9FC;font-family:Arial,sans-serif;color:#001040"><div style="max-width:560px;margin:32px auto;background:#FFFFFF;border:1px solid #D8E1EE;border-radius:16px;padding:32px"><h1 style="font-size:24px;margin:0 0 12px">${title}</h1><p style="color:#53647A;line-height:1.6">${description}</p><p style="margin:28px 0"><a href="${actionUrl}" style="display:inline-block;background:#001040;color:#FFFFFF;text-decoration:none;border-radius:10px;padding:12px 20px;font-weight:700">${actionLabel}</a></p><p style="font-size:12px;color:#53647A">Tautan berlaku selama ${expiry} dan hanya dapat digunakan satu kali. Abaikan email ini jika Anda tidak membuat permintaan tersebut.</p></div></body></html>`;
}

export function sendPasswordResetEmail({ email, resetUrl }: { email: string; resetUrl: string }) {
  return sendTransactionalEmail({
    email,
    subject: "Atur ulang kata sandi CocokIn",
    textContent: `Atur ulang kata sandi CocokIn melalui tautan berikut: ${resetUrl}\n\nTautan berlaku selama 1 jam dan hanya dapat digunakan sekali.`,
    htmlContent: emailTemplate({
      title: "Atur ulang kata sandi",
      description: "Kami menerima permintaan untuk mengatur ulang kata sandi akun CocokIn Anda.",
      actionLabel: "Atur Ulang Kata Sandi",
      actionUrl: resetUrl,
      expiry: "1 jam",
    }),
  });
}

export function sendEmailVerificationEmail({ email, verificationUrl }: { email: string; verificationUrl: string }) {
  return sendTransactionalEmail({
    email,
    subject: "Verifikasi email akun CocokIn",
    textContent: `Verifikasi email akun CocokIn melalui tautan berikut: ${verificationUrl}\n\nTautan berlaku selama 24 jam dan hanya dapat digunakan sekali.`,
    htmlContent: emailTemplate({
      title: "Verifikasi alamat email",
      description: "Selamat datang di CocokIn. Verifikasi alamat email Anda untuk melanjutkan ke onboarding akun.",
      actionLabel: "Verifikasi Email",
      actionUrl: verificationUrl,
      expiry: "24 jam",
    }),
  });
}
