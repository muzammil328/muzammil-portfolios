import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #164e63 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <p style={{ fontSize: 28, opacity: 0.8, margin: 0 }}>Muzammil Safdar</p>
      <h1 style={{ fontSize: 72, lineHeight: 1.05, margin: '20px 0 0 0' }}>Services</h1>
      <p style={{ fontSize: 28, marginTop: 20, opacity: 0.9 }}>
        Full-stack product development for startups and businesses.
      </p>
    </div>,
    {
      ...size,
    }
  );
}
