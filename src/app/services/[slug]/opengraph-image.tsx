import { ImageResponse } from 'next/og';
import { client } from '@/sanity/lib/client';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

async function fetchService(slug: string) {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      name,
      summary
    }`,
    { slug },
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchService(slug);

  const title = service?.name || 'Service';
  const description = service?.summary || 'Service details and process.';

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
      <p style={{ fontSize: 26, opacity: 0.8, margin: 0 }}>Service</p>
      <h1 style={{ fontSize: 62, lineHeight: 1.05, margin: '18px 0 0 0' }}>{title}</h1>
      <p style={{ fontSize: 26, marginTop: 18, opacity: 0.9 }}>{description}</p>
    </div>,
    {
      ...size,
    },
  );
}
