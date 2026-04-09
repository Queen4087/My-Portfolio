/**
 * Seed script — run once to create the admin account and default data.
 * Usage: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── Admin ──────────────────────────────────────────────
  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (existing) {
    console.log(`Admin "${process.env.ADMIN_USERNAME}" already exists — skipping.`);
  } else {
    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log(`✓ Admin created  username: ${process.env.ADMIN_USERNAME}  password: ${process.env.ADMIN_PASSWORD}`);
  }

  // ── Profile ────────────────────────────────────────────
  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.create({
      name: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Passionate about creating beautiful, functional, and user-friendly web experiences.',
      about: "I'm a passionate developer dedicated to creating exceptional digital experiences.\n\nWith over 5 years of experience in web development, I specialize in building modern, responsive, and user-friendly applications.",
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    });
    console.log('✓ Default profile created');
  }

  // ── Skills ─────────────────────────────────────────────
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany([
      { name: 'React', level: 95, category: 'Frontend', icon: 'FaReact', order: 1 },
      { name: 'TypeScript', level: 90, category: 'Frontend', icon: 'SiTypescript', order: 2 },
      { name: 'JavaScript', level: 95, category: 'Frontend', icon: 'SiJavascript', order: 3 },
      { name: 'CSS / Tailwind', level: 88, category: 'Frontend', icon: 'SiTailwindcss', order: 4 },
      { name: 'Node.js', level: 85, category: 'Backend', icon: 'FaNodeJs', order: 1 },
      { name: 'Python', level: 80, category: 'Backend', icon: 'FaPython', order: 2 },
      { name: 'MongoDB', level: 82, category: 'Database', icon: 'SiMongodb', order: 1 },
      { name: 'PostgreSQL', level: 78, category: 'Database', icon: 'SiPostgresql', order: 2 },
      { name: 'Docker', level: 75, category: 'DevOps', icon: 'FaDocker', order: 1 },
      { name: 'Git', level: 92, category: 'DevOps', icon: 'FaGitAlt', order: 2 },
    ]);
    console.log('✓ Default skills created');
  }

  // ── Projects ───────────────────────────────────────────
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with cart, payments, and admin panel.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
        category: 'Full Stack',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        github: 'https://github.com',
        demo: 'https://demo.com',
        featured: true, order: 1,
      },
      {
        title: 'Project Management App',
        description: 'Collaborative project management tool with real-time updates and team features.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
        category: 'Full Stack',
        tags: ['React', 'TypeScript', 'Socket.io', 'PostgreSQL'],
        github: 'https://github.com',
        demo: 'https://demo.com',
        featured: true, order: 2,
      },
      {
        title: 'Weather Dashboard',
        description: 'Beautiful weather app with forecasts, maps, and location-based data.',
        image: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80',
        category: 'Frontend',
        tags: ['React', 'OpenWeather API', 'Chart.js'],
        github: 'https://github.com',
        demo: 'https://demo.com',
        featured: false, order: 3,
      },
    ]);
    console.log('✓ Default projects created');
  }

  console.log('\n✅ Seed complete. You can now start the server with: npm run dev');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
