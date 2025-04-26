const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  stack:         { type: String, required: true },
  details:       { type: String },
  githubLink:    { type: String },
  fileUrl:       { type: String },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:        {
    type: String,
    enum: ['Not Started','In Progress','Completed','On Hold'],
    default: 'Not Started'
  },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date }
});

ProjectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Project', ProjectSchema);
