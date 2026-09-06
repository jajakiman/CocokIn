import { afterEach, describe, expect, it, vi } from "vitest";

import { sendEmailVerificationEmail, sendPasswordResetEmail } from "./brevo";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
});

describe("Brevo transactional email adapter", () => {
  it("sends password reset email through the official REST endpoint", async () => {
    process.env.BREVO_API_KEY = "api-key";
    process.env.BREVO_SENDER_EMAIL = "sender@example.com";
    process.env.BREVO_SENDER_NAME = "CocokIn";
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ messageId: "message-id" }), { status: 201 }));
    vi.stubGlobal("fetch", fetcher);

    await sendPasswordResetEmail({ email: "talent@example.com", resetUrl: "https://cocokin.example/reset-password?token=secret" });

    expect(fetcher).toHaveBeenCalledOnce();
    const [url, request] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(request.headers["api-key"]).toBe("api-key");
    expect(JSON.parse(request.body)).toMatchObject({
      sender: { name: "CocokIn", email: "sender@example.com" },
      to: [{ email: "talent@example.com" }],
      subject: "Atur ulang kata sandi CocokIn",
    });
  });

  it("throws a sanitized error when Brevo rejects verification delivery", async () => {
    process.env.BREVO_API_KEY = "api-key";
    process.env.BREVO_SENDER_EMAIL = "sender@example.com";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("sender not verified", { status: 400 })));

    await expect(sendEmailVerificationEmail({ email: "talent@example.com", verificationUrl: "https://cocokin.example/verify" }))
      .rejects.toThrow("Brevo menolak pengiriman email (400)");
  });
});
