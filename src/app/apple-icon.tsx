import { ImageResponse } from "next/og";

// Apple touch icon — opaque background required (transparent shows as black on iOS).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* head */}
          <div style={{ width: 66, height: 66, borderRadius: 999, background: "#d81e28" }} />
          {/* shoulders */}
          <div style={{ width: 118, height: 50, borderRadius: 16, background: "#1f3a93", marginTop: -6 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
