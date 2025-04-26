import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

export default function ProjectListPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const params = user.role==='admin'
      ? {}
      : { assignedUser: user.id };
    API.get('/projects', { params })
       .then(r => setProjects(r.data));
  }, [user]);

  return (
    <>
      <h2>Projects</h2>
      {projects.map(p=>(
        <ProjectCard key={p.id} project={p} />
      ))}
      {projects.length===0 && (
        <p className="text-center text-muted">No projects found.</p>
      )}
    </>
  );
}
