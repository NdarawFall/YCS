import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff0000 0%, #a80000 100%)",
          borderRadius: "8px",
          color: "white",
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: "-0.05em",
          // Compense l'espace sous la ligne de base pour centrer la lettre
          paddingBottom: 2,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
