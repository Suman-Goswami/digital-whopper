const mongoose = require('mongoose');
const { Schema } = mongoose;

/* ---------- User account ---------- */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true }
  },
  { timestamps: true }
);

/* ---------- Service (core service cards + detail pages) ---------- */
const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    icon: { type: String, default: 'sparkles' }, // icon key used by frontend
    accent: { type: String, default: '#FF4D8D' },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/* ---------- Testimonial ---------- */
const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    quote: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/* ---------- Strategy step ---------- */
const strategySchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/* ---------- Milestone (timeline) ---------- */
const milestoneSchema = new Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/* ---------- Blog post ---------- */
const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: 'Digital Whopper' },
    externalUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/* ---------- FAQ ---------- */
const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/* ---------- Site settings (contact info, socials, hero copy) ---------- */
const siteSettingsSchema = new Schema(
  {
    key: { type: String, default: 'main', unique: true },
    brandName: String,
    heroEyebrow: String,
    heroTitle: String,
    heroBody: String,
    aboutTitle: String,
    aboutBody: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    mapEmbed: String,
    socials: {
      facebook: String,
      instagram: String,
      linkedin: String
    },
    stats: [
      {
        value: String,
        label: String
      }
    ]
  },
  { timestamps: true }
);

/* ---------- Enquiry (contact form submissions) ---------- */
const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    service: { type: String, trim: true, default: 'General' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', userSchema),
  Service: mongoose.model('Service', serviceSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  StrategyStep: mongoose.model('StrategyStep', strategySchema),
  Milestone: mongoose.model('Milestone', milestoneSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Faq: mongoose.model('Faq', faqSchema),
  SiteSettings: mongoose.model('SiteSettings', siteSettingsSchema),
  Enquiry: mongoose.model('Enquiry', enquirySchema)
};
