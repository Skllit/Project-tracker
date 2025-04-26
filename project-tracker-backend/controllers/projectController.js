// controllers/projectController.js
const mongoose = require('mongoose');
const Project  = require('../models/Project');
const User     = require('../models/User');

async function resolveUserIds(values) {
  // values: array of strings which might be IDs or usernames
  if (!Array.isArray(values)) return [];

  const ids   = values.filter(v => mongoose.Types.ObjectId.isValid(v));
  const names = values.filter(v => !mongoose.Types.ObjectId.isValid(v));

  // find users by _id or username
  const users = await User.find({
    $or: [
      { _id: { $in: ids } },
      { username: { $in: names } }
    ]
  });

  return users.map(u => u._id);
}

async function resolveAssignedBy(value) {
  if (!value) return undefined;
  // if valid ObjectId, return it
  if (mongoose.Types.ObjectId.isValid(value)) return value;
  // else lookup by username
  const user = await User.findOne({ username: value });
  return user ? user._id : undefined;
}

exports.getProjects = async (req, res, next) => {
  try {
    const { search, stack, status, sort, assignedUser } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { details: new RegExp(search, 'i') }
    ];
    if (stack)  filter.stack  = new RegExp(`^${stack}$`, 'i');
    if (status) filter.status = status;
    if (assignedUser) filter.assignedUsers = assignedUser;

    let q = Project.find(filter)
      .populate('assignedUsers', 'username')
      .populate('assignedBy',    'username');

    if (sort) q = q.sort({ [sort]: 1 });

    const projects = await q;
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const proj = await Project.findById(req.params.id)
      .populate('assignedUsers', 'username')
      .populate('assignedBy',    'username');
    if (!proj) return res.status(404).json({ message: 'Not found' });
    res.json(proj);
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    // 1) Normalize incoming form data
    let { assignedUsers, assignedBy, ...rest } = req.body;
    // if assignedUsers is a single string, turn into array
    if (typeof assignedUsers === 'string') {
      assignedUsers = assignedUsers.split(',').map(v => v.trim());
    }

    // 2) Resolve to ObjectId[]
    const userIds     = await resolveUserIds(assignedUsers || []);
    const assignedById = await resolveAssignedBy(assignedBy);

    // 3) Build project payload
    const payload = {
      ...rest,
      assignedUsers: userIds,
      assignedBy:    assignedById,
      fileUrl:       req.file ? `/uploads/${req.file.filename}` : undefined,
      createdAt:     new Date()
    };

    // 4) Create & populate
    const proj = await Project.create(payload);
    const populated = await Project.findById(proj._id)
      .populate('assignedUsers', 'username')
      .populate('assignedBy',    'username');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    let { assignedUsers, assignedBy, ...rest } = req.body;
    if (typeof assignedUsers === 'string') {
      assignedUsers = assignedUsers.split(',').map(v => v.trim());
    }

    const userIds     = await resolveUserIds(assignedUsers || []);
    const assignedById = await resolveAssignedBy(assignedBy);

    const payload = {
      ...rest,
      assignedUsers: userIds,
      assignedBy:    assignedById,
      updatedAt:     new Date()
    };
    if (req.file) payload.fileUrl = `/uploads/${req.file.filename}`;

    const proj = await Project.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    )
      .populate('assignedUsers', 'username')
      .populate('assignedBy',    'username');

    if (!proj) return res.status(404).json({ message: 'Not found' });
    res.json(proj);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
