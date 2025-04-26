// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Project = require('./models/Project');

const users = [
  { username: 'admin',    email: 'admin@example.com',    password: 'admin123',    role: 'admin' },
  { username: 'alice',    email: 'alice@example.com',    password: 'alice123',    role: 'user'  },
  { username: 'bob',      email: 'bob@example.com',      password: 'bob123',      role: 'user'  },
  { username: 'charlie',  email: 'charlie@example.com',  password: 'charlie123',  role: 'user'  },
  { username: 'dave',     email: 'dave@example.com',     password: 'dave123',     role: 'user'  },
  { username: 'eve',      email: 'eve@example.com',      password: 'eve123',      role: 'admin' },
  { username: 'frank',    email: 'frank@example.com',    password: 'frank123',    role: 'user'  },
  { username: 'grace',    email: 'grace@example.com',    password: 'grace123',    role: 'user'  },
];

const projects = [
  {
    title:      'Kanban Board',
    stack:      'React, Node.js, Express',
    details:    'A Trello-style Kanban board with drag-and-drop.',
    githubLink: 'https://github.com/example/kanban-board',
    assignedBy: 'admin',
    assignedUsers: ['alice','bob'],
    status:     'In Progress'
  },
  {
    title:      'Chat App',
    stack:      'Python, Django, WebSockets',
    details:    'Real-time chat rooms and direct messages.',
    githubLink: 'https://github.com/example/chat-app',
    assignedBy: 'eve',
    assignedUsers: ['charlie','dave'],
    status:     'Not Started'
  },
  {
    title:      'API Server',
    stack:      'Node.js, Express, MongoDB',
    details:    'RESTful API for our tracker data.',
    githubLink: 'https://github.com/example/api-server',
    assignedBy: 'alice',
    assignedUsers: ['bob','charlie'],
    status:     'Completed'
  },
  {
    title:      'Mobile Companion',
    stack:      'React Native',
    details:    'iOS/Android app with push reminders.',
    githubLink: 'https://github.com/example/mobile-app',
    assignedBy: 'bob',
    assignedUsers: ['dave'],
    status:     'On Hold'
  },
  {
    title:      'E-commerce Site',
    stack:      'Next.js, Stripe, PostgreSQL',
    details:    'Full-stack store with payments.',
    githubLink: 'https://github.com/example/ecommerce',
    assignedBy: 'charlie',
    assignedUsers: ['grace','frank'],
    status:     'In Progress'
  },
  {
    title:      'CRM Tool',
    stack:      'Laravel, MySQL',
    details:    'Manage customers and sales pipeline.',
    githubLink: 'https://github.com/example/crm-tool',
    assignedBy: 'admin',
    assignedUsers: ['frank','dave'],
    status:     'Completed'
  },
  {
    title:      'Portfolio Builder',
    stack:      'Vue.js, Firebase',
    details:    'Drag-and-drop personal sites.',
    githubLink: 'https://github.com/example/portfolio-builder',
    assignedBy: 'eve',
    assignedUsers: ['alice','grace'],
    status:     'In Progress'
  },
  {
    title:      'Static Blog Engine',
    stack:      'Gatsby, GraphQL',
    details:    'Markdown-powered static blog.',
    githubLink: 'https://github.com/example/blog-engine',
    assignedBy: 'frank',
    assignedUsers: ['bob'],
    status:     'Not Started'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // 1) Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('🧹 Cleared users & projects');

    // 2) Insert users
    const createdUsers = await User.insertMany(
      users.map(u => ({ ...u, createdAt: new Date() }))
    );
    console.log(`👤 Inserted ${createdUsers.length} users`);

    // 3) Build username → _id map
    const userMap = createdUsers.reduce((m, u) => {
      m[u.username] = u._id;
      return m;
    }, {});

    // 4) Enrich projects with real ObjectId refs + timestamps
    const enriched = projects.map(p => ({
      title:         p.title,
      stack:         p.stack,
      details:       p.details,
      githubLink:    p.githubLink,
      fileUrl:       p.fileUrl, // if you want to add one
      assignedBy:    userMap[p.assignedBy],
      assignedUsers: p.assignedUsers.map(name => userMap[name]),
      status:        p.status,
      createdAt:     new Date(),
      updatedAt:     new Date()
    }));

    // 5) Insert projects
    const createdProjects = await Project.insertMany(enriched);
    console.log(`📦 Inserted ${createdProjects.length} projects`);

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
