/**
 * Seed script — populates MongoDB with all Digital Whopper site content.
 * Run:  npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const {
  Service,
  Testimonial,
  StrategyStep,
  Milestone,
  Blog,
  Faq,
  SiteSettings
} = require('../models');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/digital_whopper';

/* ============================ DATA ============================ */

const services = [
  {
    title: 'App & Shopify Development',
    slug: 'mobile-application-development-company-in-jaipur',
    tagline: 'Code with creativity',
    description:
      'Level up your digital presence with our tech gurus. We build lasting digital experiences — apps and Shopify stores engineered with creativity to give your brand a transformation worth a “woah!”',
    icon: 'code',
    accent: '#FF4D8D',
    order: 1
  },
  {
    title: 'SEO & SMO Optimisation',
    slug: 'seo-smo-optimisation',
    tagline: 'Be seen. Be heard.',
    description:
      'If you’re not visible, you don’t stand online. Our SEO & SMO strategies give your brand a voice that resonates with your audience — and rank you at the top with proven optimisation techniques.',
    icon: 'search',
    accent: '#FFB454',
    order: 2
  },
  {
    title: 'E-Commerce',
    slug: 'ecommerce-marketing-services',
    tagline: 'Traffic → sales',
    description:
      'Turn traffic into sales. We craft digital stores that nudge customers to buy on every visit — across Amazon, Etsy, Flipkart and beyond.',
    icon: 'cart',
    accent: '#8B5CF6',
    order: 3
  },
  {
    title: 'Performance Marketing',
    slug: 'performance-marketing-agency',
    tagline: 'Beyond clicks — conversions',
    description:
      'Data-driven Google & Meta Ads that boost your ROI. We never stop at clicks; we engineer campaigns that drive real conversions.',
    icon: 'rocket',
    accent: '#22D3EE',
    order: 4
  },
  {
    title: 'Web Design & Development',
    slug: 'web-development-company-in-jaipur',
    tagline: 'Websites that work',
    description:
      'Fast, beautiful, conversion-focused websites built to make your brand unforgettable — designed, developed and optimised end to end.',
    icon: 'layout',
    accent: '#34D399',
    order: 5
  }
];

const testimonials = [
  {
    name: 'Nikita Roy',
    role: 'Fashion Brand Owner',
    rating: 5,
    quote:
      'The team is quite supportive — they patiently listen to every query and understand exactly what is needed. Our online visibility has improved significantly.',
    order: 1
  },
  {
    name: 'Saurabh Sharma',
    role: 'Founder, Home Décor Business',
    rating: 4.8,
    quote:
      'We wanted a partner who could help us rank at the top of search results. Soon after starting with Digital Whopper’s SEO team, we began seeing positive results. Truly professional with impressive output.',
    order: 2
  },
  {
    name: 'Dev Saxena',
    role: 'Small Business Owner',
    rating: 4.8,
    quote:
      'I ran an offline store and wanted to take it online, but my own attempts didn’t deliver. Digital Whopper ran campaigns that brought great ROI — really happy working with them!',
    order: 3
  },
  {
    name: 'Shruti Yadav',
    role: 'Influencer',
    rating: 4.8,
    quote:
      'Thanks to Digital Whopper’s social media team, our reach has grown remarkably over the past few months. We’re really satisfied with their work.',
    order: 4
  }
];

const strategySteps = [
  { title: 'The Spark', subtitle: 'Turning vision to reality', order: 1 },
  { title: 'Foundation', subtitle: 'Blending technology with human creativity', order: 2 },
  { title: 'Strategic Growth', subtitle: 'Scale with vision', order: 3 },
  { title: 'Digital Excellence', subtitle: 'Passion, precision, and mastery', order: 4 },
  { title: 'Innovation Drive', subtitle: 'Pushing boundaries with unique strategies', order: 5 },
  { title: 'Client Expansion', subtitle: 'Building across diverse sectors', order: 6 }
];

const milestones = [
  {
    year: '2020',
    title: 'Started our mission',
    description:
      'We took the first step towards transforming the business landscape and opening avenues to thrive in the digital world.',
    order: 1
  },
  {
    year: '2021',
    title: 'Expansion',
    description:
      'Starting from our founder’s vision, we expanded both our professional team and the services we offer.',
    order: 2
  },
  {
    year: '2022',
    title: 'First Milestone',
    description:
      'With 50+ businesses successfully built, our turning point arrived with Ekatra — our Shark Tank India client.',
    order: 3
  },
  {
    year: '2023–24',
    title: '100+ Projects',
    description:
      'Counting on projects, we built the online reputation of a century of brands this year — with many more to come.',
    order: 4
  },
  {
    year: '2025',
    title: 'Second Milestone',
    description:
      'Five years into our digitalisation mission, we’re recognised by the Government of Rajasthan and proudly funded for expansion. This is not the end — many more milestones await.',
    order: 5
  }
];

const blogs = [
  {
    title: 'Meta Andromeda Update: Breaking Down the Buzz',
    slug: 'meta-andromeda-update-breaking-down-the-buzz',
    excerpt:
      'If you’re a marketer, you must have heard about the recent “Meta Andromeda” update. Here’s what it means for your campaigns.',
    externalUrl:
      'https://digitalwhopper.com/meta-andromeda-update-breaking-down-the-buzz',
    publishedAt: new Date('2026-01-10')
  },
  {
    title: 'Top 10 Tips to Build Your Social Media Brand in 2026',
    slug: 'top-10-tips-to-build-your-social-media-brand-in-2026',
    excerpt:
      'Social media is indispensable for anyone building a brand today. These core social media marketing strategies will set you apart.',
    externalUrl:
      'https://digitalwhopper.com/top-10-tips-to-build-your-social-media-brand-in-2026-the-core-social-media-marketing-strategies',
    publishedAt: new Date('2026-02-02')
  },
  {
    title: 'E-commerce Marketing in 2026: Top 5 Proven Strategies to Boost Sales',
    slug: 'e-commerce-marketing-in-2026-top-5-proven-strategies',
    excerpt:
      'Calling all business owners — five simple, proven e-commerce strategies to grow your sales in 2026.',
    externalUrl:
      'https://digitalwhopper.com/e-commerce-marketing-in-2026-top-5-simple-proven-strategies-to-boost-your-sales',
    publishedAt: new Date('2026-03-05')
  }
];

const faqs = [
  {
    question: 'Which e-commerce platforms does Digital Whopper manage?',
    answer:
      'We manage stores across all major platforms — Amazon, Flipkart, Etsy, Shopify and more — handling listings, optimisation, ads and growth end to end.',
    order: 1
  },
  {
    question: 'Does Digital Whopper also help with website design and UI/UX?',
    answer:
      'Absolutely. Our design and development team builds fast, modern, conversion-focused websites with carefully crafted UI/UX for web and mobile.',
    order: 2
  },
  {
    question: 'Which industrial sectors does Digital Whopper work with?',
    answer:
      'We work across diverse sectors — fashion, home décor, D2C startups, retail, services and more. From Shark Tank startups to established brands, our strategies adapt to your industry.',
    order: 3
  },
  {
    question: 'Does Digital Whopper provide regular progress reports to clients?',
    answer:
      'Yes. Transparent reporting is a core part of how we work — you receive regular performance reports covering rankings, traffic, ad spend and conversions.',
    order: 4
  },
  {
    question: 'What are the charges for digital marketing services at Digital Whopper?',
    answer:
      'Pricing depends on the scope and goals of your project. Reach out for a free consultation and we’ll craft a plan that fits your budget.',
    order: 5
  }
];

const siteSettings = {
  key: 'main',
  brandName: 'Digital Whopper',
  heroEyebrow: 'Best digital marketing agency in Jaipur',
  heroTitle: 'Take your business online — and make it impossible to ignore.',
  heroBody:
    'You’ve built a great product and poured endless hours into perfecting it. But online, your competitors keep ranking first while your business stays invisible. Digital Whopper helps businesses like yours get seen, get clicks, and get results.',
  aboutTitle: 'Let’s Whoop Your Business',
  aboutBody:
    'We provide 360° online marketing services — from SEO and social media campaigns to complete branding solutions — so your brand dominates the digital market. Our expert team uses ethical tactics to drive exponential organic growth. Building a start-up? Expanding an established business? We’ve scaled brands like Mani and Ekatra into people’s favourites, and we’ll help you build yours.',
  phone: '+91 6200379161',
  whatsapp: 'https://wa.me/916200379161',
  email: 'hello@digitalwhopper.com',
  address:
    '3rd Floor, 4/11, Vidyut Abhiyanta Colony, Sector 4, Malviya Nagar, Jaipur, Rajasthan 302017',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6551406698873!2d75.81422959999999!3d26.8509189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db70d6ddc5739%3A0x26f55464d633e961!2sDigital%20Whopper%20-%20digital%20marketing%20agency%20in%20Jaipur!5e0!3m2!1sen!2sin!4v1759486410948!5m2!1sen!2sin',
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
};

/* ============================ RUN ============================ */

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      StrategyStep.deleteMany({}),
      Milestone.deleteMany({}),
      Blog.deleteMany({}),
      Faq.deleteMany({}),
      SiteSettings.deleteMany({})
    ]);
    console.log('🧹 Cleared existing collections');

    await Service.insertMany(services);
    await Testimonial.insertMany(testimonials);
    await StrategyStep.insertMany(strategySteps);
    await Milestone.insertMany(milestones);
    await Blog.insertMany(blogs);
    await Faq.insertMany(faqs);
    await SiteSettings.create(siteSettings);

    console.log('🌱 Seed complete:');
    console.log(`   • ${services.length} services`);
    console.log(`   • ${testimonials.length} testimonials`);
    console.log(`   • ${strategySteps.length} strategy steps`);
    console.log(`   • ${milestones.length} milestones`);
    console.log(`   • ${blogs.length} blogs`);
    console.log(`   • ${faqs.length} FAQs`);
    console.log('   • 1 site settings document');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
