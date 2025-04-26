const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const Project = require('./models/Project'); // Update path if different

  // Or your env var

const users = [
  { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { username: 'alice', email: 'alice@example.com', password: 'alice123', role: 'user' },
  { username: 'bob', email: 'bob@example.com', password: 'bob123', role: 'user' },
  { username: 'charlie', email: 'charlie@example.com', password: 'charlie123', role: 'user' },
  { username: 'dave', email: 'dave@example.com', password: 'dave123', role: 'user' },
  { username: 'eve', email: 'eve@example.com', password: 'eve123', role: 'admin' },
  { username: 'frank', email: 'frank@example.com', password: 'frank123', role: 'user' },
  { username: 'grace', email: 'grace@example.com', password: 'grace123', role: 'user' },
];

const projects = [
  {
    title: 'Kanban Board',
    stack: 'React, Node.js, Express',
    details: 'A Trello-style kanban board with drag-and-drop cards.',
    githubLink: 'https://github.com/example/kanban-board',
    assignedBy: 'admin',
    assignedUsers: ['alice', 'bob'],
    status: 'In Progress'
  },
  {
    title: 'Chat App',
    stack: 'Python, Django, WebSockets',
    details: 'Real-time group chat with rooms and private messaging.',
    githubLink: 'https://github.com/example/chat-app',
    assignedBy: 'eve',
    assignedUsers: ['charlie', 'dave'],
    status: 'Not Started'
  },
  {
    title: 'API Server',
    stack: 'Node.js, Express, MongoDB',
    details: 'RESTful API for project tracker data.',
    githubLink: 'https://github.com/example/api-server',
    assignedBy: 'alice',
    assignedUsers: ['bob', 'charlie'],
    status: 'Completed'
  },
  {
    title: 'Mobile App',
    stack: 'React Native',
    details: 'iOS/Android app for reminders and push notifications.',
    githubLink: 'https://github.com/example/mobile-app',
    assignedBy: 'bob',
    assignedUsers: ['dave'],
    status: 'On Hold'
  },
  {
    title: 'E-commerce Site',
    stack: 'Next.js, Stripe, PostgreSQL',
    details: 'Online store with cart, checkout, and payment gateway.',
    githubLink: 'https://github.com/example/ecommerce',
    assignedBy: 'charlie',
    assignedUsers: ['grace', 'frank'],
    status: 'In Progress'
  },
  {
    title: 'CRM Tool',
    stack: 'Laravel, MySQL',
    details: 'Customer relationship management platform.',
    githubLink: 'https://github.com/example/crm-tool',
    assignedBy: 'admin',
    assignedUsers: ['frank', 'dave'],
    status: 'Completed'
  },
  {
    title: 'Portfolio Builder',
    stack: 'Vue.js, Firebase',
    details: 'Drag-and-drop tool to build personal portfolios.',
    githubLink: 'https://github.com/example/portfolio-builder',
    assignedBy: 'eve',
    assignedUsers: ['alice', 'grace'],
    status: 'In Progress'
  },
  {
    title: 'Blog Engine',
    stack: 'Gatsby, GraphQL',
    details: 'Static blog generator with Markdown and tags.',
    githubLink: 'https://github.com/example/blog-engine',
    assignedBy: 'frank',
    assignedUsers: ['bob'],
    status: 'Not Started'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('🍃 Connected to MongoDB');

    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('🧹 Cleared old data');

    const createdUsers = await User.insertMany(users);
    const userMap = createdUsers.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});

    const enrichedProjects = projects.map(p => ({
      ...p,
      assignedBy: userMap[p.assignedBy],
      assignedUsers: p.assignedUsers.map(u => userMap[u]),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await Project.insertMany(enrichedProjects);
    console.log('✅ Seeded users and projects');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
