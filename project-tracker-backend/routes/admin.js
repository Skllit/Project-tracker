const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');

// GET /api/admin/stats — basic admin dashboard data
router.get('/stats', async (req, res) => {
  try {
    const userCount    = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const users        = await User.find().select('-password');

    const statusCounts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      users,
      userCount,
      projectCount,
      statusCounts
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/admin.js

router.get('/stats', async (req, res) => {
    try {
      const users = await User.find().select('username').lean();
      const projects = await Project.find().lean();
  
      const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});
  
      const userProjectMap = projects.reduce((acc, project) => {
        acc[project.owner] = (acc[project.owner] || 0) + 1;
        return acc;
      }, {});
  
      const usersWithProjectCount = users.map(user => ({
        ...user,
        projectCount: userProjectMap[user._id] || 0,
      }));
  
      res.json({
        statusCounts: Object.entries(statusCounts).map(([status, count]) => ({ _id: status, count })),
        users: usersWithProjectCount,
      });
    } catch (err) {
      console.error('Admin stats error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
