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
          backgroundColor: "#FF0000",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "60%",
            height: "60%",
            gap: "10%",
          }}
        >
          <div style={{ width: "45%", height: "45%", backgroundColor: "white", borderRadius: "2px" }} />
          <div style={{ width: "45%", height: "45%", backgroundColor: "white", borderRadius: "2px" }} />
          <div style={{ width: "45%", height: "45%", backgroundColor: "white", borderRadius: "2px" }} />
          <div style={{ width: "45%", height: "45%", backgroundColor: "white", borderRadius: "2px" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
