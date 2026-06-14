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

export const authRequest = async (mode, payload) => {
  const res = await fetch(`/api/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Account request failed');
  return json.data;
};

/* ----------------- Fallback content (mirrors the seed) ----------------- */
export const FALLBACK = {
  site: {
    brandName: 'Digital Whopper',
    heroEyebrow: 'Best digital marketing agency in Jaipur',
    heroTitle: 'Take your business online — and make it impossible to ignore.',
    heroBody:
      'You’ve built a great product and poured endless hours into perfecting it. But online, your competitors keep ranking first while your business stays invisible. Digital Whopper helps businesses like yours get seen, get clicks, and get results.',
    aboutTitle: 'Let’s Whoop Your Business',
    aboutBody:
      'We provide 360° online marketing services — from SEO and social media campaigns to complete branding solutions — so your brand dominates the digital market. Our expert team uses ethical tactics to drive exponential organic growth. We’ve scaled brands like Mani and Ekatra into people’s favourites, and we’ll help you build yours.',
    phone: '+91 6200379161',
    whatsapp: 'https://wa.me/916200379161',
    email: 'hello@digitalwhopper.com',
    address:
      '3rd Floor, 4/11, Vidyut Abhiyanta Colony, Sector 4, Malviya Nagar, Jaipur, Rajasthan 302017',
    socials: {
      facebook: 'https://www.facebook.com/officialdigitalwhopper',
      instagram: 'https://www.instagram.com/digital_whopper/',
      linkedin: 'https://www.linkedin.com/company/digitalwhopper/'
    },
    stats: [
      { value: '100+', label: 'Projects delivered' },
      { value: '5+', label: 'Years of growth' },
      { value: '50+', label: 'Brands built by 2022' },
      { value: '360°', label: 'Marketing services' }
    ]
  },
  services: [
    {
      title: 'App & Shopify Development',
      slug: 'app-shopify',
      tagline: 'Code with creativity',
      description:
        'Level up your digital presence with our tech gurus. We build lasting digital experiences — apps and Shopify stores engineered to give your brand a transformation worth a “woah!”',
      icon: 'code',
      accent: '#FF4D8D'
    },
    {
      title: 'SEO & SMO Optimisation',
      slug: 'seo-smo',
      tagline: 'Be seen. Be heard.',
      description:
        'If you’re not visible, you don’t stand online. Our SEO & SMO strategies give your brand a voice that resonates — and rank you at the top.',
      icon: 'search',
      accent: '#FFB454'
    },
    {
      title: 'E-Commerce',
      slug: 'ecommerce',
      tagline: 'Traffic → sales',
      description:
        'Turn traffic into sales. We craft digital stores that nudge customers to buy on every visit — across Amazon, Etsy, Flipkart and beyond.',
      icon: 'cart',
      accent: '#8B5CF6'
    },
    {
      title: 'Performance Marketing',
      slug: 'performance',
      tagline: 'Beyond clicks — conversions',
      description:
        'Data-driven Google & Meta Ads that boost your ROI. We never stop at clicks; we engineer campaigns that drive real conversions.',
      icon: 'rocket',
      accent: '#22D3EE'
    },
    {
      title: 'Web Design & Development',
      slug: 'web',
      tagline: 'Websites that work',
      description:
        'Fast, beautiful, conversion-focused websites built to make your brand unforgettable — designed, developed and optimised end to end.',
      icon: 'layout',
      accent: '#34D399'
    }
  ],
  testimonials: [
    {
      name: 'Nikita Roy',
      role: 'Fashion Brand Owner',
      rating: 5,
      quote:
        'The team is quite supportive — they patiently listen to every query and understand exactly what is needed. Our online visibility has improved significantly.'
    },
    {
      name: 'Saurabh Sharma',
      role: 'Founder, Home Décor Business',
      rating: 4.8,
      quote:
        'We wanted a partner who could help us rank at the top of search results. Soon after starting with Digital Whopper’s SEO team, we began seeing positive results. Truly professional.'
    },
    {
      name: 'Dev Saxena',
      role: 'Small Business Owner',
      rating: 4.8,
      quote:
        'I ran an offline store and wanted to take it online, but my own attempts didn’t deliver. Digital Whopper ran campaigns that brought great ROI — really happy!'
    },
    {
      name: 'Shruti Yadav',
      role: 'Influencer',
      rating: 4.8,
      quote:
        'Thanks to Digital Whopper’s social media team, our reach has grown remarkably over the past few months. We’re really satisfied with their work.'
    }
  ],
  strategy: [
    { title: 'The Spark', subtitle: 'Turning vision to reality' },
    { title: 'Foundation', subtitle: 'Blending technology with human creativity' },
    { title: 'Strategic Growth', subtitle: 'Scale with vision' },
    { title: 'Digital Excellence', subtitle: 'Passion, precision, and mastery' },
    { title: 'Innovation Drive', subtitle: 'Pushing boundaries with unique strategies' },
    { title: 'Client Expansion', subtitle: 'Building across diverse sectors' }
  ],
  milestones: [
    {
      year: '2020',
      title: 'Started our mission',
      description:
        'We took the first step towards transforming the business landscape and opening avenues to thrive in the digital world.'
    },
    {
      year: '2021',
      title: 'Expansion',
      description:
        'Starting from our founder’s vision, we expanded both our professional team and the services we offer.'
    },
    {
      year: '2022',
      title: 'First Milestone',
      description:
        'With 50+ businesses successfully built, our turning point arrived with Ekatra — our Shark Tank India client.'
    },
    {
      year: '2023–24',
      title: '100+ Projects',
      description:
        'Counting on projects, we built the online reputation of a century of brands this year — with many more to come.'
    },
    {
      year: '2025',
      title: 'Second Milestone',
      description:
        'Recognised by the Government of Rajasthan and proudly funded for expansion. This is not the end — many more milestones await.'
    }
  ],
  blogs: [
    {
      title: 'Meta Andromeda Update: Breaking Down the Buzz',
      excerpt:
        'If you’re a marketer, you must have heard about the recent “Meta Andromeda” update. Here’s what it means for your campaigns.',
      type: 'meta',
      externalUrl: 'https://digitalwhopper.com/meta-andromeda-update-breaking-down-the-buzz',
      content: [
        'Meta Andromeda is Meta’s machine-learning system for Facebook and Instagram ad recommendations. It helps shortlist and push ads toward audiences who are more likely to engage.',
        'The update shifts campaign success toward creative testing. Advertisers should use diverse creative assets, UGC, testimonials, and AI-assisted variations instead of over-managing narrow targeting settings.',
        'Digital Whopper recommends focusing on creative diversity, clear persona-desire-awareness messaging, and patient campaign testing before making major optimisation changes.'
      ]
    },
    {
      title: 'Top 10 Tips to Build Your Social Media Brand in 2026',
      excerpt:
        'Social media is indispensable for anyone building a brand today. These core strategies will set you apart.',
      type: 'social-blog',
      externalUrl: 'https://digitalwhopper.com/top-10-tips-to-build-your-social-media-brand-in-2026-the-core-social-media-marketing-strategies',
      content: [
        'Building a social media brand starts with a clear vision, the right platform, and an optimised profile that reflects the long-term identity you want people to remember.',
        'The article highlights consistency, content calendars, community engagement, AI tools, influencer collaboration, and analytics as core parts of social media marketing.',
        'The main takeaway is that brand growth does not happen overnight. It comes from authentic content, regular engagement, and continuous learning from performance data.'
      ]
    },
    {
      title: 'E-commerce Marketing in 2026: Top 5 Proven Strategies',
      excerpt:
        'Calling all business owners — five simple, proven e-commerce strategies to grow your sales in 2026.',
      type: 'ecom-blog',
      externalUrl: 'https://digitalwhopper.com/e-commerce-marketing-in-2026-top-5-simple-proven-strategies-to-boost-your-sales',
      content: [
        'The post explains why e-commerce stores lose sales: stronger competitors, outdated trends, slow websites, weak product presentation, and poor mobile experiences.',
        'Digital Whopper’s recommended fixes include an intuitive mobile-friendly website, funnel optimisation, SEO, A/B testing, and cart recovery flows.',
        'The core message is simple: ads alone are not enough. Stores need trust, speed, search visibility, retention, and a smoother path from landing page to checkout.'
      ]
    }
  ],
  faqs: [
    {
      question: 'Which e-commerce platforms does Digital Whopper manage?',
      answer:
        'We manage stores across all major platforms — Amazon, Flipkart, Etsy, Shopify and more — handling listings, optimisation, ads and growth end to end.'
    },
    {
      question: 'Does Digital Whopper also help with website design and UI/UX?',
      answer:
        'Absolutely. Our design and development team builds fast, modern, conversion-focused websites with carefully crafted UI/UX for web and mobile.'
    },
    {
      question: 'Which industrial sectors does Digital Whopper work with?',
      answer:
        'We work across diverse sectors — fashion, home décor, D2C startups, retail, services and more. Our strategies adapt to your industry.'
    },
    {
      question: 'Does Digital Whopper provide regular progress reports?',
      answer:
        'Yes. Transparent reporting is core to how we work — regular reports cover rankings, traffic, ad spend and conversions.'
    },
    {
      question: 'What are the charges for digital marketing services?',
      answer:
        'Pricing depends on the scope and goals of your project. Reach out for a free consultation and we’ll craft a plan that fits your budget.'
    }
  ]
};
