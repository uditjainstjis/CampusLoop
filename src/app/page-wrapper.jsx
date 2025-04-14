// src/app/page-wrapper.jsx
import Home from './page';

async function getMentors() {
  // Replace this with actual API call or DB query
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mentors`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data;
}

export default async function PageWrapper() {
  const mentors = await getMentors();

  return <Home mentors={mentors} />;
}
