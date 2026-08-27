import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CocokIn Verified Skill Passport";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://cocokin.id";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#001040",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* ImageResponse requires a plain img element. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="64"
            src={`${siteUrl}/brand/cocokin/logo-mark.webp`}
            style={{
              objectFit: "contain",
              width: "54px",
            }}
          />
          <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            CocokIn Skill Passport
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#FF8010",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Frontend Developer • Verified Track
          </div>
          <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-0.03em" }}>
            {id.replace(/^talent-/, "").toUpperCase() || "TALENT"}
          </div>
          <div style={{ fontSize: "22px", color: "#D8E1EE" }}>
            Bukti Kesiapan Karier & Portofolio Tervalidasi UMKM
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid rgba(216, 225, 238, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 128, 16, 0.12)",
              border: "1px solid #FF8010",
              color: "#FF8010",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ✓ Official CocokIn Verified Document
          </div>
          <div style={{ fontSize: "16px", color: "#9AABC2" }}>cocokin.id</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
