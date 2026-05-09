import { client } from '@/sanity/lib/client';

export async function fetchProfile() {
  const query = `*[_type == "profile"][0]{
    name,
    label,
    summary,
    image,
    email,
    phone,
    url,
    "profiles": profiles[]{ network, username, url }
  }`;

  return client.fetch(query);
}
