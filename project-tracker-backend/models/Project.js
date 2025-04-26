const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  stack:         { type: String, required: true },
  details:       { type: String },
  githubLink:    { type: String },
  fileUrl:       { type: String },
  assignedUsers: { type: [String], default: [] },
  assignedBy:    { type: String },
  status:        { 
    type: String, 
    enum: ['Not Started','In Progress','Completed','On Hold'], 
    default: 'Not Started' 
  },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date }
}, {
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

ProjectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Project', ProjectSchema);
