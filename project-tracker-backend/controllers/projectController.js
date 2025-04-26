const Project = require('../models/Project');

// GET /api/projects?search=&stack=&status=&sort=
exports.getProjects = async (req, res, next) => {
  try {
    const { search, stack, status, sort } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title:   new RegExp(search, 'i') },
      { details: new RegExp(search, 'i') }
    ];
    if (stack)   filter.stack  = new RegExp(`^${stack}$`, 'i');
    if (status)  filter.status = status;

    let query = Project.find(filter);
    if (sort) query = query.sort({ [sort]: 1 });
    const projects = await query;
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: 'Not found' });
    res.json(proj);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      assignedUsers: req.body.assignedUsers
        ? req.body.assignedUsers.split(',').map(s => s.trim())
        : [],
      fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    };
    const proj = await Project.create(data);
    res.status(201).json(proj);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      assignedUsers: req.body.assignedUsers
        ? req.body.assignedUsers.split(',').map(s => s.trim())
        : [],
      updatedAt: Date.now()
    };
    if (req.file) data.fileUrl = `/uploads/${req.file.filename}`;

    const proj = await Project.findByIdAndUpdate(
      req.params.id, data, { new: true }
    );
    if (!proj) return res.status(404).json({ message: 'Not found' });
    res.json(proj);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
