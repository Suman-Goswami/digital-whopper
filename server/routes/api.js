const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const {
  User,
  Service,
  Testimonial,
  StrategyStep,
  Milestone,
  Blog,
  Faq,
  SiteSettings,
  Enquiry
} = require('../models');

const router = express.Router();

/* Small helper to keep handlers tidy */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => ({
  salt,
  hash: crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex')
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many account attempts, please try again later.' }
});

router.post(
  '/auth/signup',
  authLimiter,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const { salt, hash } = hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash
    });

    res.status(201).json({ success: true, message: 'Account created.', data: publicUser(user) });
  })
);

router.post(
  '/auth/signin',
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const { hash } = hashPassword(password, user.passwordSalt);
    const ok = crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.passwordHash, 'hex'));
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    res.json({ success: true, message: 'Signed in.', data: publicUser(user) });
  })
);

/* ---------- GET /api/site : settings, contact, hero copy ---------- */
router.get(
  '/site',
  asyncHandler(async (req, res) => {
    const site = await SiteSettings.findOne({ key: 'main' }).lean();
    res.json({ success: true, data: site });
  })
);

/* ---------- GET /api/services ---------- */
router.get(
  '/services',
  asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: services.length, data: services });
  })
);

/* ---------- GET /api/services/:slug ---------- */
router.get(
  '/services/:slug',
  asyncHandler(async (req, res) => {
    const service = await Service.findOne({ slug: req.params.slug }).lean();
    if (!service)
      return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  })
);

/* ---------- GET /api/testimonials ---------- */
router.get(
  '/testimonials',
  asyncHandler(async (req, res) => {
    const items = await Testimonial.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

/* ---------- GET /api/strategy ---------- */
router.get(
  '/strategy',
  asyncHandler(async (req, res) => {
    const items = await StrategyStep.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

/* ---------- GET /api/milestones ---------- */
router.get(
  '/milestones',
  asyncHandler(async (req, res) => {
    const items = await Milestone.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

/* ---------- GET /api/blogs ---------- */
router.get(
  '/blogs',
  asyncHandler(async (req, res) => {
    const items = await Blog.find().sort({ publishedAt: -1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

/* ---------- GET /api/faqs ---------- */
router.get(
  '/faqs',
  asyncHandler(async (req, res) => {
    const items = await Faq.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

/* ---------- POST /api/enquiries : contact form (rate limited) ---------- */
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, error: 'Too many enquiries, please try again later.' }
});

router.post(
  '/enquiries',
  enquiryLimiter,
  asyncHandler(async (req, res) => {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, error: 'Name, email and message are required.' });
    }
    const enquiry = await Enquiry.create({ name, email, phone, service, message });
    res.status(201).json({
      success: true,
      message: "Thanks! Whoppy received your message — we'll get back within 24 hours.",
      data: { id: enquiry._id }
    });
  })
);

/* ---------- GET /api/enquiries : simple admin listing ---------- */
router.get(
  '/enquiries',
  asyncHandler(async (req, res) => {
    const items = await Enquiry.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: items.length, data: items });
  })
);

module.exports = router;
