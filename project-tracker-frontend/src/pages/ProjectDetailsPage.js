import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    API.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => {
        console.error('Failed to fetch project:', err);
        // maybe redirect or show a message here
      });
  }, [id]);

  if (!project) return <p>Loading…</p>;

  // Safely extract usernames (or “None” if empty)
  const assignedTo = project.assignedUsers?.length
    ? project.assignedUsers.map(u => u.username).join(', ')
    : 'None';
  const assignedBy = project.assignedBy?.username || 'None';

  return (
    <div className="card p-4">
      <h2>{project.title}</h2>

      <p><strong>Stack:</strong> {project.stack}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Assigned To:</strong> {assignedTo}</p>
      <p><strong>Assigned By:</strong> {assignedBy}</p>

      <hr />

      <p>
        <strong>Details:</strong><br/>
        {project.details}
      </p>

      {project.githubLink && (
        <p>
          <strong>GitHub:</strong>{' '}
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            {project.githubLink}
          </a>
        </p>
      )}

      {project.fileUrl && (
        <p>
          <strong>File:</strong>{' '}
          <a href={project.fileUrl} target="_blank" rel="noreferrer">
            Download
          </a>
        </p>
      )}

      <div className="mt-4">
        <Link to={`/projects/${id}/edit`} className="btn btn-secondary me-2">
          Edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => {
            API.delete(`/projects/${id}`)
              .then(() => navigate('/projects'))
              .catch(err => {
                console.error('Delete failed:', err);
              });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
