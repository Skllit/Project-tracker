require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');
const usersRoute = require('./routes/users');
const piRoute    = require('./routes/projects');
const errorHandler = require('./middleware/errorHandler');
const authRoute    = require('./routes/auth');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();

app.use('/api/users',    usersRoute);
app.use('/api/projects', piRoute);
app.use('/api/auth',     authRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
