import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Alberto — Desarrollador Web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const t = await getTranslations("metadata");

  return new ImageResponse(
    <div
      style={{
        background: "#fbfaf7",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          color: "#15805b",
          fontSize: 24,
          letterSpacing: 8,
          marginBottom: 24,
        }}
      >
        PORTFOLIO
      </div>
      <div
        style={{
          color: "#1f2a44",
          fontSize: 80,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {t("title")}
      </div>
      <div
        style={{
          color: "rgba(31,42,68,0.56)",
          fontSize: 28,
          marginTop: 24,
        }}
      >
        {t("description")}
      </div>
    </div>,
    { ...size },
  );
}
