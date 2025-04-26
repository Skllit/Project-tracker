const express = require('express');
const multer  = require('multer');
const path    = require('path');
const pc      = require('../controllers/projectController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/',    pc.getProjects);
router.get('/:id', pc.getProjectById);
router.post('/',   upload.single('file'),     pc.createProject);
router.put('/:id', upload.single('file'),     pc.updateProject);
router.delete('/:id',                         pc.deleteProject);

module.exports = router;
