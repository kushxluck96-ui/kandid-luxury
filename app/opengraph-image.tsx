import { ImageResponse } from "next/og";

export const alt = "Kandid Luxury 100% Pure Pearl Powder";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#F8F8F6",
          color: "#171717",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid #D8B67D",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            padding: "64px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#6B6B6B",
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
            }}
          >
            Kandid Luxury
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "serif",
              fontSize: 76,
              lineHeight: 1.05,
              marginTop: 34,
            }}
          >
            100% Pure Pearl Powder
          </div>
          <div
            style={{
              color: "#595959",
              display: "flex",
              fontSize: 28,
              marginTop: 28,
            }}
          >
            A refined ritual for luminous-looking skin.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
