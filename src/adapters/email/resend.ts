export async function sendPasswordResetEmail({ email, resetUrl }: { email: string; resetUrl: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email reset password belum dikonfigurasi");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Atur ulang kata sandi CocokIn",
      html: `<p>Permintaan reset kata sandi diterima.</p><p><a href="${resetUrl}">Atur ulang kata sandi</a></p><p>Link berlaku selama 1 jam. Abaikan email ini jika Anda tidak meminta reset.</p>`,
    }),
  });
  if (!response.ok) throw new Error("Email reset password gagal dikirim");
}
