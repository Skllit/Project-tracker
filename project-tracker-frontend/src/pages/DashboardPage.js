import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="text-center mt-5">
      <h1>Welcome to Project Tracker</h1>
      <p className="mt-3">
        <Link className="btn btn-primary me-2" to="/projects">
          View Projects
        </Link>
        <Link className="btn btn-success" to="/projects/new">
          Create New Project
        </Link>
      </p>
    </div>
  );
}
