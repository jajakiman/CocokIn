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
          backgroundColor: "#0F2431",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#0DB8D3",
              color: "#0F2431",
              fontWeight: 900,
              fontSize: "28px",
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            C
          </div>
          <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            CocokIn Skill Passport
          </span>
        </div>

        {/* Passport Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#0DB8D3",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Frontend Developer • Verified Track
          </div>
          <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-0.03em" }}>
            {id.replace(/^talent-/, "").toUpperCase() || "TALENT"}
          </div>
          <div style={{ fontSize: "22px", color: "#C9E0E8" }}>
            Bukti Kesiapan Karier & Portofolio Tervalidasi UMKM
          </div>
        </div>

        {/* Footer Meta Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid rgba(201, 224, 232, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(13, 184, 211, 0.15)",
              border: "1px solid #0DB8D3",
              color: "#0DB8D3",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ✓ Official CocokIn Verified Document
          </div>
          <div style={{ fontSize: "16px", color: "#94B9C7" }}>cocokin.id</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
