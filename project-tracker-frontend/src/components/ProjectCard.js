import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  // Safely build “Assigned To” and “Assigned By” strings
  const assignedUsersList = project.assignedUsers?.length
    ? project.assignedUsers.map(u => u.username).join(', ')
    : 'None';
  const assignedByUser = project.assignedBy?.username || 'None';

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </h5>

        <p className="mb-1">
          <strong>Stack:</strong> {project.stack}
        </p>
        <p className="mb-1">
          <strong>Status:</strong> {project.status}
        </p>
        <p className="mb-1">
          <strong>Assigned To:</strong> {assignedUsersList}
        </p>
        <p>
          <strong>Assigned By:</strong> {assignedByUser}
        </p>
      </div>
    </div>
  );
}
