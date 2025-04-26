import React, { useState, useEffect } from 'react';
import API from '../api';
import ProjectCard from '../components/ProjectCard';

const STATUSES = ['Not Started','In Progress','Completed','On Hold'];

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [search,   setSearch]   = useState('');
  const [stack,    setStack]    = useState('');
  const [status,   setStatus]   = useState('');
  const [sort,     setSort]     = useState('title');

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/projects', {
        params: { search, stack, status, sort }
      });
      setProjects(res.data);
    };
    fetch();
  }, [search, stack, status, sort]);

  return (
    <>
      <h2>Projects</h2>
      <div className="row gy-3 mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Stack..."
            value={stack}
            onChange={e => setStack(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdAt">Date Created</option>
          </select>
        </div>
      </div>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </>
  );
}
