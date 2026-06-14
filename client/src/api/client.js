/**
 * Tiny API client for the Express backend.
 * Every getter falls back to bundled content if the API is unreachable,
 * so the UI never renders empty during development.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const apiUrl = (path) => {
  return API_BASE_URL ? `${API_BASE_URL}/api/${path}` : `/api/${path}`;
};

const get = async (path) => {
  const res = await fetch(apiUrl(path));
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  const json = await res.json();
  return json.data;
};

export const fetchAll = async () => {
  const [site, services, testimonials, strategy, milestones, blogs, faqs] =
    await Promise.all([
      get('site').catch(() => FALLBACK.site),
      get('services').catch(() => FALLBACK.services),
      get('testimonials').catch(() => FALLBACK.testimonials),
      get('strategy').catch(() => FALLBACK.strategy),
      get('milestones').catch(() => FALLBACK.milestones),
      get('blogs').catch(() => FALLBACK.blogs),
      get('faqs').catch(() => FALLBACK.faqs)
    ]);

  return {
    site: site || FALLBACK.site,
    services: services?.length ? services : FALLBACK.services,
    testimonials: testimonials?.length ? testimonials : FALLBACK.testimonials,
    strategy: strategy?.length ? strategy : FALLBACK.strategy,
    milestones: milestones?.length ? milestones : FALLBACK.milestones,
    blogs: blogs?.length ? blogs : FALLBACK.blogs,
    faqs: faqs?.length ? faqs : FALLBACK.faqs
  };
};

export const postEnquiry = async (payload) => {
  const res = await fetch(apiUrl('enquiries'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Something went wrong');
  return json;
};

export const authRequest = async (mode, payload) => {
  const res = await fetch(apiUrl(`auth/${mode}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Account request failed');
  return json.data;
};