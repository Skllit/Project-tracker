import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    API.get(`/projects/${id}`).then(res => setProject(res.data));
  }, [id]);

  if (!project) return <p>Loading…</p>;

  return (
    <div className="card p-4">
      <h2>{project.title}</h2>
      <p><strong>Stack:</strong> {project.stack}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Assigned To:</strong> {project.assignedUsers.join(', ')}</p>
      <p><strong>Assigned By:</strong> {project.assignedBy}</p>
      <hr/>
      <p><strong>Details:</strong><br/>{project.details}</p>
      <p>
        <strong>GitHub:</strong>{' '}
        <a href={project.githubLink} target="_blank" rel="noreferrer">
          {project.githubLink}
        </a>
      </p>
      {project.fileUrl && (
        <p>
          <strong>File:</strong>{' '}
          <a href={project.fileUrl} target="_blank" rel="noreferrer">
            Download
          </a>
        </p>
      )}
      <div className="mt-4">
        <Link className="btn btn-secondary me-2" to={`/projects/${id}/edit`}>
          Edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => {
            API.delete(`/projects/${id}`).then(() => nav('/projects'));
          }}
        >
          Delete
        </button>
      </div>
      <hr/>
      <h5>Activity Feed</h5>
      <p className="text-muted">(coming soon…)</p>
    </div>
  );
}
