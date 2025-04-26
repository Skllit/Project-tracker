require('dotenv').config();
const express      = require('express');
const bodyParser   = require('body-parser');
const cors         = require('cors');
const path         = require('path');
const connectDB    = require('./config/db');
const usersRoute   = require('./routes/users');
const projectsRoute= require('./routes/projects');
const errorHandler = require('./middleware/errorHandler');
const isAdmin = require('./middleware/isAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Mongo
connectDB();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users',    usersRoute);
app.use('/api/projects', projectsRoute);

app.use('/api/admin', isAdmin, require('./routes/admin'));

// Error handling
app.use(errorHandler);

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
